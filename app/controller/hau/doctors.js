const createError = require('http-errors');

module.exports = app => {
  class DoctorController extends app.Controller {
    async index() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        deptId: Joi.string(),
        deptType: Joi.number(),
        startDate: Joi.string(),
        endDate: Joi.string(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const doctorList = await app.repository.Doctor.findAll();
      this.success(doctorList);
    }

    async getScheduleInfos() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        doctorId: Joi.string().required(),
        deptId: Joi.string().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const doctor = await app.repository.Doctor.findById(data.doctorId, data.deptId);
      if (doctor) {
        const scheduleInfos = await doctor.getScheduleInfos();
        return this.success(scheduleInfos);
      }
      this.success([]);
    }
  }
  return DoctorController;
};
