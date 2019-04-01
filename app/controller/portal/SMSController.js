'use strict';

const Controller = require('egg').Controller;

class SMSController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SMSService = ctx.service.sMSService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async send() {
    const { username } = this.ctx.request.body;
    const response = await this.SMSService.send(username);
    this.ctx.body = response;
  }
}

module.exports = SMSController;
