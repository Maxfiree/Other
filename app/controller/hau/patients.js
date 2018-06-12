const createError = require('http-errors');

module.exports = app => {
  class PatientsController extends app.Controller {
    async index() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        pageSize: Joi.number(),
        currentPage: Joi.number(),
        healthCardNo: Joi.string().max(36),
        idCard: Joi.string().max(18),
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
      const where = {};
      if (data.healthCardNo) where.healthCardNo = data.healthCardNo;
      if (data.idCard) where.idCard = data.idCard;
      const res = await this.ctx.repository.Patient.findAndCountAll({
        where,
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
      const res = await this.ctx.repository.Patient.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      this.success(res);
    }

    async create() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        hospitalId: Joi.string().min(1).max(36),
        patientGroupId: Joi.number().integer(),
        patientName: Joi.string().max(36).required(),
        phone: Joi.string().max(20),
        healthCardNo: Joi.string().max(36).required(),
        medicareCardNo: Joi.string().max(36),
        idCard: Joi.string().min(15).max(18),
        oppatNo: Joi.string().max(36),
        admissionNo: Joi.string().max(36),
        sex: Joi.number().integer(),
        type: Joi.number().integer(),
        age: Joi.number().integer(),
        address: Joi.string().max(255),
        birthDay: Joi.date(),
        status: Joi.number().integer(),
        description: Joi.string().max(100),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Patient.create(data);
      if (!res) { throw createError(403, 'create fail', { code: 1007 }); }
      this.success(res);
    }

    async update() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        hospitalId: Joi.string().min(1).max(36),
        patientGroupId: Joi.number().integer(),
        patientName: Joi.string().max(36),
        phone: Joi.string().max(20),
        healthCardNo: Joi.string().max(36),
        medicareCardNo: Joi.string().max(36),
        idCard: Joi.string().min(15).max(18),
        oppatNo: Joi.string().max(36),
        admissionNo: Joi.string().max(36),
        sex: Joi.number().integer(),
        type: Joi.number().integer(),
        age: Joi.number().integer(),
        address: Joi.string().max(255),
        birthDay: Joi.date(),
        status: Joi.number().integer(),
        description: Joi.string().max(100),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Patient.update(data, { where: { id: data.id } });
      if (!res[0]) { throw createError(404, 'update fail', { code: 1006 }); }
      this.success(this.ctx.helper.infoFilter(data));
    }

    async getAccount() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Account.findOne({ where: { patientId: data.id } });
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      this.success(res);
    }

    async removeAccount() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Patient.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      await res.setAccount(null);
      this.success();
    }

    async addAccount() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        accountId: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Patient.findById(data.id);
      const account = await this.ctx.repository.Account.findById(data.accountId);
      if (!(res && account)) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      await res.setAccount(account);
      this.success();
    }

    async createAccount() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        accountId: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.Patient.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      const t = await this.ctx.model.transaction();
      try {
        const account = await this.ctx.repository.Account.create({ description: '患者编号' + data.id + '的预交金账号' }, { transaction: t });
        await res.setAccount(account, { transaction: t });
        await t.commit();
        this.success(res);
      } catch (e) {
        await t.rollback();
        throw e;
      }
    }
  }
  return PatientsController;
};
