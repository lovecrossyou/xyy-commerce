'use strict';

const Controller = require('egg').Controller;

class PushController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.request = ctx.request;
    this.PushService = ctx.service.pushService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.ProductService = ctx.service.productService;
  }

  async pushMessage() {
    const { id } = this.request.body;
    this.PushService.pushMessage(id);
    this.ctx.body = 'pushMessage test';
  }

  async bindUser() {
    const body = this.request.body;
    const response = await this.PushService.bindUser(body);
    this.ctx.body = response;
  }
}

module.exports = PushController;
