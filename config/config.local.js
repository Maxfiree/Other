const datasources = require('./datasources.local');
module.exports = () => {
  const exports = {};

  exports.static = {
    maxAge: 0, // maxAge 缓存，默认 1 年
  };

  exports.sequelize = datasources.sequelize;

  return exports;
};
