'use strict';

const Controller = require('egg').Controller;

class ShopController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.ShopService = ctx.service.shopService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  //   创建店铺
  async create() {
    const shop = this.ctx.request.body;
    const response = await this.ShopService.register(shop);
    this.ctx.body = response;
  }

  // 查询店铺信息
  async queryShopInfo() {
    const shop = this.ctx.request.body;
    const response = await this.ShopService.queryShopInfo(shop);
    this.ctx.body = response;
  }

  // 更新店铺信息
  async update() {
    const shop = this.ctx.request.body;
    const response = await this.ShopService.updateShopInfo(shop);
    this.ctx.body = response;
  }
}

module.exports = ShopController;
