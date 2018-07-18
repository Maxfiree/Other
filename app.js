const R = require('ramda');
module.exports = app => {
  /**
   * 自定义controller
   */
  class CustomController extends app.Controller {
    /**
     * 封装body，默认error:0
     * @param {string} data 返回数据
     */
    success(data) {
      if (data && data.toJSON) { // a sequelize instance
        data = data.toJSON();
      }
      if (data && data.rows) {
        if (data.rows instanceof Array) {
          data.rows = data.rows.map(r => {
            if (r.toJSON) { r = r.toJSON(); }
            return R.omit([ 'created_at', 'updated_at', 'fullPath', 'pathName' ], r);
          });
        }
      } else {
        data = R.omit([ 'created_at', 'updated_at', 'fullPath', 'pathName' ], data);
      }
      this.ctx.body = {
        error: 0,
        data,
      };
    }
    /**
     * 封装body，默认error:0
     * @param {number} error 错误states code
     * @param {string} data 返回数据
     */
    error(error, data) {
      this.ctx.body = {
        error,
        data,
      };
    }
    /**
     * 简化request.post获取
     * @param {string} key 入参key
     * @return {string} 返回body[key]
     */
    get POST() {
      return Object.assign(this.ctx.request.body, this.ctx.params);
    }
    /**
     * 简化request.get获取
     * @param {string} key 入参key
     * @return {string} 返回body[key]
     */
    get GET() {
      return Object.assign(this.ctx.request.query, this.ctx.params);
    }
  }
  app.Controller = CustomController;
  app.beforeStart(async function() {
    // 应用会等待这个函数执行完成才启动
  });
  app.logger.info('[Framework Middleware]', '' + app.config.coreMiddleware);
  app.logger.info('[App Middleware]', '' + app.config.appMiddleware);
};
