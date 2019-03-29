const Controller = require('egg').Controller;
const _ = require('lodash');

class CategoryController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.CategoryService = ctx.service.categoryService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.CategoryManageService = ctx.service.categoryManageService;
  }

  // 获取某分类下平级子分类
  async getCategoryInShop() {
    const { shopId = 0, parentId = 0 } = this.resquest.body;
    const response = await this.CategoryService.ChildParallelCagtegory(shopId, parentId);
    this.ctx.body = response;
  }
}


module.exports = CategoryController;
