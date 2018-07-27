'use strict';
var urll=require("url");
var qs=require("querystring");
var fs= require("fs");
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async else() {
    const { ctx,app }=this;
    const { req, res }=ctx;
    console.log("\n\nOK");
    var data=fs.readFileSync('app/public/index.html','utf-8')
      res.writeHead(200,{ 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
      console.log(ctx.request.body.name+"\n"+ctx.request.body.age);
      console.log(ctx.get('content-type'));
      var cok=ctx.headers.cookie;
      console.log(cok);

  }
}

module.exports = HomeController;
