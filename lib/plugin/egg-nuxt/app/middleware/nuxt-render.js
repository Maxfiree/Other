
module.exports = (config, app) => {
  return async (ctx, next) => {
    // webpack hot reload
    if (/^\/cn\/.*/.test(ctx.path)) {
      ctx.status = 200;
      const path = ctx.path;
      if (/\.js$/.test(path)) {
        ctx.set('Content-Type', 'application/javascript');
      }
      if (/\.css/.test(path)) {
        ctx.set('Content-Type', 'text/css');
      }
      await new Promise((resolve, reject) => {
        ctx.res.on('close', resolve);
        ctx.res.on('finish', resolve);
        app.nuxt.render(ctx.req, ctx.res, err => {
          if (err) return reject(err);
          resolve();
        });
      });
    } else {
      await next();
    }
  };
};
