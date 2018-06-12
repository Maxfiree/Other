module.exports = app => {
  app.config.coreMiddleware.splice(0, 0, 'nuxtRender');
  app.messenger.on('nuxtstart', async () => {
    if (app.config.nuxt.web) {
      if (app.config.nuxt.webBuilder) {
        const { Builder } = require('nuxt');
        try {
          const builder = new Builder(app.nuxt);
          await builder.build();
          console.log('[nuxt] Building web done');
        } catch (e) {
          console.log('[nuxt] Building web error', e);
        }
      }
      app.logger.info('[nuxt]', 'init web finish');
    }
  });
};
