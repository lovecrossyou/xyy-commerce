const Service = require('egg').Service;
const _ = require('lodash');

class CategoryService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ShopModel = ctx.model.ShopModel;
    this.CategoryModel = ctx.model.CategoryModel;
    this.session = ctx.session;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  
  /**
   * @param {根据店铺ID查找分类} shopId
   * @param {*} parentId
   */
  async ChildParallelCagtegory(shopId, parentId = 0) {
    const shopRow = await this.ShopModel.findOne({ where: { id: shopId } });
    if (!shopRow) return this.ServerResponse.createByErrorMsg('查找店铺信息失败');

    const cagtegoryRows = await this.CategoryModel.findAll({
      // attributes: [ 'id', 'parentId', 'name', 'status' ],
      where: { parentId, shopId },
    }).then(rows => rows && rows.map(r => r.toJSON()));
    if (cagtegoryRows.length < 1) {
      this.ctx.logger.info('ChildParallelCagtegory: 未找到当前分类的子分类');
    }
    return this.ServerResponse.createBySuccessMsgAndData('获取分类成功', cagtegoryRows);
  }
}

module.exports = CategoryService;
