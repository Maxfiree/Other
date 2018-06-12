const createError = require('http-errors');

module.exports = app => {
  class OrdersController extends app.Controller {
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
      const res = await this.ctx.repository.Order.findAndCountAll({
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
      });
      this.success(res);
    }

    async show() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.string().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Order.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      this.success(res);
    }

    async refund() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.string().required(),
        tradeId: Joi.string().max(36).require(),
        refundPrice: Joi.number().integer().positive().require(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const order = await this.ctx.repository.Order.findById(data.id);
      if (!order) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      if (order.refundPrice + data.refundPrice > order.price) {
        throw createError(400, VInfo.error, { code: 2001 });
      }
      const fromAccount = await this.ctx.repository.Account.findById(order.fromId);
      const toAccount = await this.ctx.repository.Account.findById(order.toId);
      if (!(fromAccount && toAccount)) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      const t = await this.ctx.model.transaction();
      try {
        const refund = await this.ctx.repository.Refund.create({
          toId: order.fromId,
          fromId: order.toId,
          orderId: order.orderId,
          refundId: `WPD${String((new Date()).getTime()).substr(-10)}${Math.floor((Math.random() * 900 + 100))}`,
          tradeId: data.tradeId,
          refundTime: new Date(),
          price: data.refundPrice,
          operatorId: this.user.id,
        }, { transaction: t });
        order.status = 4;
        order.refundPrice = order.refundPrice + data.refundPrice;
        fromAccount.balance = fromAccount.balance + data.refundPrice;
        toAccount.balance = toAccount.balance - data.refundPrice;
        const promises = [];
        promises.push(fromAccount.save({ transaction: t }));
        promises.push(toAccount.save({ transaction: t }));
        promises.push(order.save({ transaction: t }));
        await Promise.all(promises);
        await t.commit();
        this.success(refund);
      } catch (e) {
        await t.rollback();
        throw e;
      }
    }
  }
  return OrdersController;
};
