'use strict';
const uuidv1 = require('uuid/v1');

const Service = require('egg').Service;

class TokenService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.TokenModel = ctx.model.TokenModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  async saveToken(user) {
    if (!user) this.ServerResponse.createByErrorMsg('保存token user信息为空');
    const { id } = user;
    const token = await this.TokenModel.create({
      userId: id,
      tokenString: uuidv1(),
    });
    if (token) return this.ServerResponse.createBySuccessMsgAndData('登录并获取token成功', token);
    return this.ServerResponse.createByErrorMsg('保存token失败');
  }
}

module.exports = TokenService;
