const mock = require('egg-mock');
const app = mock.app();
/**
 * 程序数据库预初始化
 */
const initial = async function() {
  await app.ready();
  app.logger.info('[install]', 'init done');
  await app.model.sync();
  app.logger.info('[install]', 'sequelize sync finish');
  const ctx = app.mockContext();
  // password bcrypt(md5('admin'))
  await ctx.repository.Account.create({ id: 1, balance: 0, description: '医院总账户' });
  app.logger.info('[install]', 'install finish!');
};

(async function() {
  try {
    await initial();
  } catch (e) {
    app.logger.error(e);
  } finally {
    process.exit(0);
  }
})();
