module.exports = (options, app) => {
  return async function(ctx, next) {
    if (!ctx.helper.testUrl(ctx.path, app.config.access.ignorePaths)) {
      await app.passport.authenticate('jwt', {
        session: false,
        successReturnToOrRedirect: false,
        successRedirect: false,
        // failureRedirect: ctx.path,
        failWithError: true,
      })(ctx, () => { return; });
    } else {
      // no throw exception
      await app.passport.authenticate('jwt', {
        session: false,
        successReturnToOrRedirect: false,
        successRedirect: false,
        // failureRedirect: ctx.path,
        failWithError: false,
      })(ctx, () => { return; });
      // don't let authenticate change the status code;
      ctx.status = 404;
      ctx.response._explicitStatus = false;
      ctx.type = 'text/html';
    }

    await next();
  };
};

