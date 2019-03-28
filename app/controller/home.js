'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
    console.log('this.ctx.app ', this.ctx.app.config.sequelize);
  }
}

module.exports = HomeController;
