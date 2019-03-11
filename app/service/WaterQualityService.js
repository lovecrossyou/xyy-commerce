'use strict';

const Service = require('egg').Service;

class WaterQualityService extends Service {
  constructor(ctx) {
    super(ctx);
    this.WaterQualityItemModel = ctx.model.WaterQualityItemModel;
    this.CategoryModel = ctx.model.CategoryModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  /**
     *
     * @param {添加水质监测项} item
     */
  async addItem(item) {
    if (!item) return this.ServerResponse.createByErrorMsg('水质监测项参数不正确');
    const resultRow = await this.WaterQualityItemModel.findOne({ where: { id: item.id } });
    let itemRow,
      addOrUpdate;
    if (!resultRow) {
      // TODO 添加
      itemRow = await this.WaterQualityItemModel.create(item);
      addOrUpdate = '添加';
      if (!itemRow) return this.ServerResponse.createByErrorMsg('添加监测项失败');
    } else {
      // TODO 更新
      const [ updateCount, [ updateRow ]] = await this.WaterQualityItemModel.update(item, {
        where: { id: item.id },
        individualHooks: true,
      });
      addOrUpdate = '更新';
      if (updateCount < 1) return this.ServerResponse.createByErrorMsg('更新监测项失败');
      itemRow = updateRow;
    }
    return this.ServerResponse.createBySuccessMsgAndData(`${addOrUpdate}监测项成功`, itemRow.toJSON());
  }
}

module.exports = WaterQualityService;
