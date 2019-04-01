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
  async create(sms) {
    const smsRow = await this.SMSModel.create(sms);
    if (!smsRow) return this.ServerResponse.createByErrorMsg('生成验证码失败');
    return smsRow;
  }

  /**
   * @param {发送验证码} phoneNum
   */
  async send(phoneNum) {
    const code = this.ctx.helper.rand4();
    const sms = {
      phoneNum,
      code,
    };
    // 调用第三方发送接口
    const sendOK = true;
    let res;
    if (sendOK) {
      res = await this.create(sms);
    }
    return this.ServerResponse.createBySuccessMsgAndData('发送验证码成功', res);
  }
}

module.exports = SMSService;
