'use strict';

const Service = require('egg').Service;

class SMSService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SMSModel = ctx.model.SMSModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 生成验证码
   * @param {*} phoneNum
   */
  async create(phoneNum) {
    const code = '666666';
    const sms = {
      phoneNum,
      code,
    };
    const res = this.SMSModel.create(sms);
    if (!res) return this.ServerResponse.createByErrorMsg('生成验证码失败');
  }
}

module.exports = SMSService;
