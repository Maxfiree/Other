exports.upper = async function(ctx, next) {
  ctx.request.body.name=ctx.request.body.name.toUpperCase();
  console.log("middle");
    await next();
    console.log(ctx.request.body.name);
    console.log("await middle");
  };