'use strict';
var urll = require("url");
var qs = require("querystring");
var fs = require("fs");
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index(ctx) {
    const { app } = this;
    const { req, res } = ctx;
    console.log("\n\nOK");
    var data = fs.readFileSync('app/public/index.html', 'utf-8')
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
    console.log(ctx.request.query.name + "\n" + ctx.request.query.age);
    console.log(ctx.cost + "\n" + ctx.amount);
    console.log(ctx.get('content-type'));
    var cok = ctx.headers.cookie;
    console.log(cok);
    await console.log("index");
    ctx.service.fun.find();
    ctx.service.fun.find2();
    console.log("index await");
    console.log(ctx.params.id);
    console.log("config is:"+app.config.env)
    
  }
}




// exports.new = async () => {
//   const { ctx,app }=this;
//   const { req, res }=ctx;
//     await console.log("main");
//     ctx.service.fun.find();
//     ctx.service.fun.find2();
//     console.log("main await");
// }
// exports.new = async (ctx) => {
//   if (ctx.params.id == undefined)
//     ctx.params.id = 3;
//   console.log("url:" + ctx.url);
//   console.log("new" + ctx.params.id);
// };

// exports.create = async () => { };

// exports.show = async (ctx) => {
//   console.log("show" + ctx.params.id);
//   console.log()
// };

// exports.edit = async (ctx) => {
//   console.log("url:" + ctx.url);
//   console.log("edit" + ctx.params.id);
//  };

// exports.update = async () => { };

// exports.destroy = async () => { };


module.exports = HomeController;