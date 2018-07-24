'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async else() {
    this.ctx.body = `home: ${this.ctx.query.name}`;
  }
}

module.exports = HomeController;
