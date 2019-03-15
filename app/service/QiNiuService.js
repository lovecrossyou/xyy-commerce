'use strict';

const Service = require('egg').Service;

class QiNiuService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.TokenModel = ctx.model.TokenModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  async upload2Qiniu(path, realname) {
    const { app } = this;
    return await app.qiniu.upload(path, realname);
  }
}

module.exports = QiNiuService;
