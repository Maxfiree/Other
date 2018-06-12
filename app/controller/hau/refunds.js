const createError = require('http-errors');

module.exports = app => {
  class RefundsController extends app.Controller {
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
      const res = await this.ctx.repository.Refund.findAndCountAll({
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
      const res = await this.ctx.repository.Refund.findById(data.id);
      if (!res) {
        throw createError(404, 'get fail', { code: 1006 });
      }
      this.success(res);
    }
  }
  return RefundsController;
};
