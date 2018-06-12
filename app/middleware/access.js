const path = require('path');

module.exports = () => {
  const skipExt = [ '.png', '.jpeg', '.jpg', '.ico', '.gif' ];
  return async function(ctx, next) {
    // await ctx.service.authenticate.policyValidate();
    await next();
    const rs = ctx.starttime ? Date.now() - ctx.starttime : 0;
    ctx.set('X-Response-Time', rs);

    const ext = path.extname(ctx.url).toLocaleLowerCase();
    const isSkip = skipExt.indexOf(ext) !== -1 && ctx.status < 400;

    if (!isSkip) {
      const ua = ctx.get('user-agent') || '';
      ctx.logger.info(ua);
    }
  };
};

