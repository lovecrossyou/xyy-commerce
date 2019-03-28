'use strict';

const Service = require('egg').Service;

class BannerService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.BannerModel = ctx.model.BannerModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   *
   * @param {*创建banner} banner
   */
  async saveOrUpdate(banner) {
    if (!banner) return this.ServerResponse.createByErrorMsg('输入参数有误');
    // 查询商品
    const resultRow = await this.BannerModel.findOne({ where: { id: banner.id } });
    let bannerRow,
      addOrUpdate;
    if (!resultRow) {
      // TODO 更新
      bannerRow = await this.BannerModel.create(banner);
      addOrUpdate = '添加';
      if (!bannerRow) return this.ServerResponse.createByErrorMsg('创建banner失败');
    } else {
      const [ updateCount, [ updateRow ]] = await this.BannerModel.update(banner, {
        where: { id: banner.id },
        individualHooks: true,
      });
      if (updateCount < 1) return this.ServerResponse.createByErrorMsg('更新banner失败');
      addOrUpdate = '更新';
      bannerRow = updateRow;
    }
    return this.ServerResponse.createBySuccessMsgAndData(`${addOrUpdate}banner成功`, banner);
  }

  /**
   * 查询列表
   */
  async list() {
    const list = await this.BannerModel.findAll().map(rows => rows && rows.toJSON());
    return this.ServerResponse.createBySuccessMsgAndData('查询banner成功', list);
  }
}

module.exports = BannerService;
