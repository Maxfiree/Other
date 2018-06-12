const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');

module.exports = (config, app) => {
  return mount('/m', serve(path.join(app.baseDir, 'dist-mobile')));
};
