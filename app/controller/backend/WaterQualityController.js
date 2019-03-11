'use strict';

const Controller = require('egg').Controller;

class WaterQualityController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.UserService = ctx.service.userService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.WaterQualityService = ctx.service.WaterQualityService;
    this.CategoryManageService = ctx.service.categoryManageService;
  }
  async addItem() {
    const item = this.resquest.body;
    const response = await this.WaterQualityService.addItem(item);
    this.ctx.body = response;
  }
}

module.exports = WaterQualityController;
