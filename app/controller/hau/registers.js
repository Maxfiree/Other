const createError = require('http-errors');

module.exports = app => {
  class RegisterController extends app.Controller {
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
      const res = await this.ctx.repository.Register.findAndCountAll({
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
      });
      this.success(res);
    }

    async create() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        patientId: Joi.number().integer().required(),
        deptId: Joi.string().required(),
        doctorId: Joi.string().required(),
        scheduleId: Joi.string().required(),
        periodId: Joi.string(),
        payType: Joi.number().integer().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const patient = await app.repository.Patient.findById(data.patientId);
      const doctor = await app.repository.Doctor.findById(data.doctorId, data.deptId);
      const scheduleInfo = await app.repository.ScheduleInfo.findOne({ where: { scheduleId: data.scheduleId } });
      const register = await this.ctx.service.register.createOrder(patient, doctor, scheduleInfo, null, data.payType);
      this.success(register);
    }

    async confirm() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        id: Joi.string().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      let register = await app.repository.Register.findById(data.id);
      if (!register) throw createError(404, VInfo.error, { code: 1006 });
      register = await register.confirmRegister();
      this.success(register);
    }
  }
  return RegisterController;
};
