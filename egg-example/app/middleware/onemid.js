
module.exports = () => {
  console.log("hehde");
  return async function(ctx,next) {
    console.log("middle");
    await next();
    console.log("await middle");
  }
}