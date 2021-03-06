const Controller = require('egg').Controller;
const _ = require('lodash');

class CategoryManageController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.resquest = ctx.request;
    this.UserService = ctx.service.userService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.CategoryManageService = ctx.service.categoryManageService;
  }

  // 添加类别
  async addCategory() {
    // 默认0 根节点 type为分类的类型(店铺的商品、水质检测分类)
    const { name, type, parentId = 0, summary = '' } = this.resquest.body;
    const response = await this.CategoryManageService.addCategory(name, summary, type, parentId);
    this.ctx.body = response;
  }

  // 更新品类的name
  async updateCategoryName() {
    const { name, id } = this.resquest.body;
    const response = await this.CategoryManageService.updateCategoryName(name, id);
    this.ctx.body = response;
  }

  // 获取某分类下平级子分类
  async getChildParallelCagtegory() {
    const { parentId = 0, type } = this.ctx.params;
    const response = await this.CategoryManageService.getChildParallelCagtegory(parentId, type);
    this.ctx.body = response;
  }

  // 获取某分类下的递归子分类,  返回的是Array<id>
  async getCategoryAndDeepChildCategory() {
    const { parentId = 0 } = this.ctx.params;
    const response = await this.CategoryManageService.getCategoryAndDeepChildCategory(parentId);
    this.ctx.body = response;
  }

}


module.exports = CategoryManageController;
