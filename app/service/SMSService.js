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
    const smsRow = await this.SMSModel.create(sms);
    if (!smsRow) return this.ServerResponse.createByErrorMsg('生成验证码失败');
    return this.ServerResponse.createBySuccessMsgAndData('生成验证码成功', smsRow);

  }
}

module.exports = SMSService;
