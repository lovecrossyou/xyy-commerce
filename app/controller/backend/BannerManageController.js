'use strict';

const Controller = require('egg').Controller;

class BannerManageController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.BannerService = ctx.service.bannerService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 创建 or 更新 banner
   */
  async createOrUpdate() {
    const params = this.ctx.request.body;
    const response = await this.BannerService.saveOrUpdate(params);
    this.ctx.body = response;
  }

  /**
   * banner列表
   */
  async list() {
    const response = await this.BannerService.list();
    this.ctx.body = response;
  }

}

module.exports = BannerManageController;
