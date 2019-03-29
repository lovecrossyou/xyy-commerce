/* eslint-disable strict */
const Controller = require('egg').Controller;
const _ = require('lodash');

class ShopController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.shopService = ctx.service.shopService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.ProductService = ctx.service.productService;
  }

  // 获取附近店铺列表
  async shopListNearBy() {
    const params = this.ctx.request.body;
    const response = await this.shopService.getShopListNearBy(params);
    this.ctx.body = response;
  }

  // 查询店铺信息
  async queryShopInfo() {
    const response = await this.shopService.queryShopInfo(this.ctx.query);
    this.ctx.body = response;
  }
}


module.exports = ShopController;
