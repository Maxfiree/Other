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
  
  exports.servicesInfo = {
    hau: {
      host: 'WIREDPAY_HAU',
      port: 7001,
    },
    iu: {
      host: 'WIREDPAY_IU',
      port: 7001,
    },
    pu: {
      host: 'WIREDPAY_PU',
      port: 7001,
    },
    ku: {
      host: 'WIREDPAY_KU',
      port: 7001,
    },
    gateway: {
      host: 'WIREDPAY_SERVICE',
      port: 7001,
    },
  };
  return exports;
};
