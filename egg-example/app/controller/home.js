'use strict';
var urll=require("url");
var qs=require("querystring");


const Controller = require('egg').Controller;
class HomeController extends Controller {
  async else(ctx) {
    // console.log("\n\nOK");
    // var str=urll.parse(ctx.request.url).query;
    // console.log("url is: "+ctx.request.url);
    // console.log("body is: "+ctx.request.body.name+ctx.request.body.age);
    // var str=decodeURIComponent(str);
    // console.log("decoded paramis: "+str);
    // var obj=qs.parse(str);
    // console.log(obj);
    this.ctx.body = 'home:'+ctx.query.name;
  }
}

module.exports = HomeController;
