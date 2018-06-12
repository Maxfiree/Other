/**
 * 生产环境配置
 *
 * 最终生效的配置为 prod + default（前者覆盖后者）
 */
const path = require('path');


const datasources = require('./datasources.prod');
module.exports = app => {
  const exports = {};
  exports.sequelize = datasources.sequelize;
  exports.logger = {
    consoleLevel: 'INFO',
    dir: path.join(app.baseDir, 'logs'),
  };
  if (process.env.DOMAIN_WHITE_LIST) {
    exports.security = {
      domainWhiteList: process.env.DOMAIN_WHITE_LIST.split(','),
      csrf: {
        enable: false,
      },
    };
  }
  return exports;
};
