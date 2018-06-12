module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      console.log(this.ctx.user);
      this.ctx.body = 'hi, egg';
    }

    // background example
    createBackgroundTask() {
      this.ctx.service.backgroundTask.createBackgroundTask(async () => {
        console.log('doing');
        await new Promise(resolve => { setTimeout(() => { resolve(); }, 6000); });
        console.log('finish');
        return { status: 0, result: 'ok' };
      });
    }

    async nuxt() {
      this.ctx.status = 404;
    }
  }
  return HomeController;
};
