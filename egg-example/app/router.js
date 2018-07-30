'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.post('/home', '/login',app.middleware.onemid.upper,controller.home.index);
};

