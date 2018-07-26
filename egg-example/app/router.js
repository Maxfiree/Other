'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/home', '/login',app.middlewares.onemid.upper,app.controller.home.else);
};

