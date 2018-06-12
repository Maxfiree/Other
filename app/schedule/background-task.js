const Subscription = require('egg').Subscription;
module.exports = app => {
  class BackgroundTask extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
      return {
        interval: '60s', // 1 分钟间隔
        type: 'worker', // 单worker执行
      };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
      if (!app.backgroundTaskScheduling) {
        app.scheduling = true;
        const taskInfo = app.backgroundTasksList.pop();
        if (taskInfo && taskInfo.id) {
          const res = await taskInfo.task();
          const task = await this.ctx.repository.BackgroundTask.findById(taskInfo.id);
          task.result = JSON.stringify(res.result);
          task.resultStatus = res.status;
          task.finishTime = new Date();
          task.status = 1;
          await task.save();
        }
        app.backgroundTaskScheduling = false;
      }
    }
  }
  return BackgroundTask;
};
