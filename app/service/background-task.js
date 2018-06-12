module.exports = app => {
  class BackgroundTask extends app.Service {
    /**
     * 创建后台任务
     * @param {Promise} task 后台任务 要求返回{status, result}
     * @param {string} name 任务名称
     * @param {Integer} type 任务类型
     * @return {Integer} taskId
     */
    async createBackgroundTask(task, name, type) {
      const data = {};
      data.name = name ? name : '后台任务';
      data.type = type ? type : 1;
      data.startTime = new Date();
      const res = await this.ctx.repository.BackgroundTask.create(data);
      app.backgroundTasksList.push({ id: res.id, task });
      return res.id;
    }
  }
  return BackgroundTask;
};
