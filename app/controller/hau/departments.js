const createError = require('http-errors');

module.exports = app => {
  class DepartmentController extends app.Controller {
    async index() {
      const departmentList = await app.repository.Department.findAll();
      this.success(departmentList);
    }
    async getDoctors() {
      const Joi = app.Joi;
      const schema = Joi.object().keys({
        deptId: Joi.string().required(),
      });
      const VInfo = this.ctx.validate(schema);
      if (VInfo.error) {
        throw createError(400, VInfo.error, { code: 1001 });
      }
      const data = VInfo.value;
      const department = await app.repository.Department.findById(data.deptId);
      if (department) {
        const doctorList = await department.getRegisterDoctors();
        return this.success(doctorList);
      }
      this.success([]);
    }
  }
  return DepartmentController;
};
