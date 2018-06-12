module.exports = app => {
  app.config.coreMiddleware.splice(0, 0, 'nuxtRenderMobile');
  app.messenger.on('nuxtstartMobile', async () => {
    if (app.config.nuxtMobile.web) {
      if (app.config.nuxtMobile.webBuilder) {
        const { Builder } = require('nuxt');
        try {
          const builder = new Builder(app.nuxtMobile);
          await builder.build();
          console.log('[nuxt] Building web-mobile done');
        } catch (e) {
          console.log('[nuxt] Building web-mobile error', e);
        }
      }
      app.logger.info('[nuxt]', 'init web-mobile finish');
    }
  });
};
