'use strict';
const path = require('path');

const Controller = require('egg').Controller;

class QiNiuController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.UserService = ctx.service.userService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.QiNiuService = ctx.service.qiNiuService;
  }

  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    this.ctx.body = file;

    const { filepath, filename } = file;
    const imgInfo = await this.QiNiuService.upload2Qiniu(filepath, filename);
    const response = this.ServerResponse.createBySuccessMsgAndData('上传文件成功', imgInfo);
    this.ctx.body = response;

  }
}

module.exports = QiNiuController;
