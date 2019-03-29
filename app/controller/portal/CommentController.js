'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.request = ctx.request;
    this.CommentService = ctx.service.commentService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.ProductService = ctx.service.productService;
  }

  async create() {
    const body = this.request.body;
    const response = await this.CommentService.create(body);
    this.ctx.body = response;
  }

  async list() {
    const { productId = 0 } = this.request.body;
    const response = await this.CommentService.list(productId);
    this.ctx.body = response;
  }
}

module.exports = CommentController;
