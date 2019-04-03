'use strict';

const Controller = require('egg').Controller;

class PushController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.PushService = ctx.service.pushService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.ProductService = ctx.service.productService;
  }

  async pushMessage() {
    const { id } = this.ctx.params;
    this.pushService.pushMessage(id);
  }
}

module.exports = PushController;
