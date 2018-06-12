const createError = require('http-errors');

module.exports = app => {
  class AccountsController extends app.Controller {
    async index() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        pageSize: Joi.number(),
        currentPage: Joi.number(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      let pageSize = data.pageSize;
      let currentPage = data.currentPage;
      if (!pageSize) pageSize = 15;
      if (pageSize > 100) pageSize = 100;
      if (!currentPage) currentPage = 1;
      const res = await this.ctx.repository.Account.findAndCountAll({
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
      });
      this.success(res);
    }

    async show() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Account.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      this.success(res);
    }

    async create() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        type: Joi.number().integer(),
        status: Joi.number().integer(),
        description: Joi.string().max(100),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Account.create(data);
      if (!res) { throw createError(403, 'create fail', { code: 1007 }); }
      this.success(res);
    }

    async update() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        type: Joi.number().integer(),
        status: Joi.number().integer(),
        description: Joi.string().max(100),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Account.update(data, { where: { id: data.id } });
      if (!res[0]) { throw createError(404, 'update fail', { code: 1006 }); }
      this.success(this.ctx.helper.infoFilter(data));
    }

    async getExpenditures() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        pageSize: Joi.number(),
        currentPage: Joi.number(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Account.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      let pageSize = data.pageSize;
      let currentPage = data.currentPage;
      if (!pageSize) pageSize = 15;
      if (pageSize > 100) pageSize = 100;
      if (!currentPage) currentPage = 1;
      const orders = await this.ctx.repository.Order.findAndCountAll({
        where: { fromId: data.id },
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
      });
      this.success(orders);
    }


    async getIncomes() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        pageSize: Joi.number(),
        currentPage: Joi.number(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Account.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      let pageSize = data.pageSize;
      let currentPage = data.currentPage;
      if (!pageSize) pageSize = 15;
      if (pageSize > 100) pageSize = 100;
      if (!currentPage) currentPage = 1;
      const orders = await this.ctx.repository.Order.findAndCountAll({
        where: { toId: data.id },
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
      });
      this.success(orders);
    }

    async createOrder() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        type: Joi.number().integer().require(),
        tradeId: Joi.string().max(36).require(),
        price: Joi.number().integer().positive().require(),
        toAccount: Joi.number().integer(),
        description: Joi.string().max(100),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      data.operatorId = this.user.id;
      data.status = 2;
      data.payTime = new Date();
      // generate id
      data.orderId = `WPD${String((new Date()).getTime()).substr(-10)}${Math.floor((Math.random() * 900 + 100))}`;
      // 1充值 2消费 3退费 4转账
      if (data.type === 1) {
        data.fromId = 1;
        data.toId = data.id;
      } else if (data.type === 2) {
        data.fromId = data.id;
        data.toId = 1;
      } else if (data.type === 3) {
        data.fromId = data.id;
        data.toId = 1;
      } else if (data.type === 4 && data.toAccount) {
        data.fromId = data.id;
        data.toId = data.toAccount;
      } else {
        throw createError(400, 'type error', { code: 1001 });
      }

      const fromAccount = await this.ctx.repository.Account.findById(data.fromId);
      const toAccount = await this.ctx.repository.Account.findById(data.toId);
      if (!(fromAccount && toAccount)) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      const t = await this.ctx.model.transaction();
      try {
        const res = await this.ctx.repository.Order.create(data, { transaction: t });
        fromAccount.balance = fromAccount.balance - data.price;
        toAccount.balance = toAccount.balance + data.price;
        await fromAccount.save({ transaction: t });
        await toAccount.save({ transaction: t });
        await t.commit();
        this.success(res);
      } catch (e) {
        await t.rollback();
        throw e;
      }
    }
  }
  return AccountsController;
};
