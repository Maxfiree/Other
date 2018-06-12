const createError = require('http-errors');

module.exports = app => {
  class PatientGroupsController extends app.Controller {
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
      const res = await this.ctx.repository.PatientGroup.findAndCountAll({
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
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      this.success(res);
    }

    async create() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        hospitalId: Joi.string().min(1).max(36),
        name: Joi.string().max(36),
        status: Joi.number().integer(),
        description: Joi.string().max(100),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.PatientGroup.create(data);
      if (!res) { throw createError(403, 'create fail', { code: 1007 }); }
      this.success(res);
    }

    async update() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        hospitalId: Joi.string().min(1).max(36),
        name: Joi.string().max(36),
        status: Joi.number().integer(),
        description: Joi.string().max(100),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.PatientGroup.update(data, { where: { id: data.id } });
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
      const res = await this.ctx.repository.Account.findOne({ where: { patientGroupId: data.id } });
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
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
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
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
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
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
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

    async getPatients() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      let pageSize = data.pageSize;
      let currentPage = data.currentPage;
      if (!pageSize) pageSize = 15;
      if (pageSize > 100) pageSize = 100;
      if (!currentPage) currentPage = 1;
      const patients = await this.ctx.repository.Patient.findAndCountAll({
        where: { patientGroupId: data.id },
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
      });
      this.success(patients);
    }

    async removePatient() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        patientId: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
      const patient = await this.ctx.repository.Patient.findById(data.patientId);
      if (!(res && patient)) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      if (res.masterId === patient.id) {
        throw createError(404, 'resource rely', { code: 1010 });
      }
      await res.removePatient(patient);
      this.success();
    }

    async addPatient() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        patientId: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
      const patient = await this.ctx.repository.Patient.findById(data.patientId);
      if (!(res && patient)) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      await res.addPatient(patient);
      this.success();
    }

    async updateMaster() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        patientId: Joi.number().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const res = await this.ctx.repository.PatientGroup.findById(data.id);
      const patient = await this.ctx.repository.Patient.findById(data.patientId);
      if (!(res && patient)) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      if (res.id !== patient.patientGroupId) {
        throw createError(404, 'resource rely', { code: 1010 });
      }
      res.masterId = patient.id;
      await res.save();
      this.success();
    }
  }
  return PatientGroupsController;
};
