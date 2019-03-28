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
  async create(banner) {
    if (!banner) return this.ServerResponse.createByErrorMsg('输入参数有误');
    banner = await this.BannerModel.create(banner);
    if (!banner) return this.ServerResponse.createByErrorMsg('创建banner失败');
    banner = banner.toJSON();
    return this.ServerResponse.createBySuccessMsgAndData('创建banner成功', banner);
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
