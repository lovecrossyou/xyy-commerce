'use strict';

const Controller = require('egg').Controller;

class MapController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.request = ctx.request;
    this.MapService = ctx.service.mapService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.ProductService = ctx.service.productService;
  }

  async search() {
    const { keywords, city } = this.request.body;
    const response = await this.MapService.search(keywords, city);
    this.ctx.body = response;
  }
}

module.exports = MapController;
