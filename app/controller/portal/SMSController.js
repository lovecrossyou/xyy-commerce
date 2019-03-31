'use strict';

const Controller = require('egg').Controller;

class SMSController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SMSService = ctx.service.smsService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async create() {
    const { username } = this.ctx.request.body;
    const response = await this.SMSService.createSMS(username);
    this.ctx.body = response;
  }
}

module.exports = SMSController;
