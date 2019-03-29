/* eslint-disable no-bitwise */
/* eslint-disable jsdoc/check-param-names */
const Service = require('egg').Service;
const _ = require('lodash');
const { SHOPNAME } = require('../common/type');


class ShopService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.ShopModel = ctx.model.ShopModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  /**
   *
   * @param field {String}
   * @param value {String}
   * @return {Promise.<boolean>}
   */
  async _checkExistColByField(field, value) {
    const data = await this.ShopModel.findOne({
      attributes: [ field ],
      where: { [field]: value },
    });
    return !!data;
  }

  /**
   * @feature 校验 shopname
   * @param value {String}
   * @param type {String}
   * @return ServerResponse.msg
   */
  async checkValid(type, value) {
    if (type.trim()) {
      if (SHOPNAME === type) {
        return await this._checkExistColByField(SHOPNAME, value)
          ? this.ServerResponse.createByErrorMsg('店铺名已存在')
          : this.ServerResponse.createBySuccessMsg('店铺名不存在');
      }
    }
    return this.ServerResponse.createByErrorMsg('参数错误');
  }

  /**
   * @feature 注册店铺
   * @param user {Object} { shopname, ... }
   * @return {Promise.<void>}
   */
  async register(shop) {
    // 店铺已存在
    const validShopNameResponse = await this.checkValid(SHOPNAME, shop.name);
    if (!validShopNameResponse.isSuccess()) return validShopNameResponse;
    try {
      const { id: userId } = this.session.currentUser;
      shop = { ...shop, userId };
      shop = await this.ShopModel.create(shop);
      if (!shop) return this.ServerResponse.createByErrorMsg('注册失败1');
      return this.ServerResponse.createBySuccessMsgAndData('注册成功', shop);
    } catch (e) {
      console.log(e);
      return this.ServerResponse.createByErrorMsg('注册失败2');
    }
  }


  /**
   * @feature 更新店铺信息
   * @param shopInfo
   * @return {Promise.<ServerResponse>}
   */
  async updateShopInfo(shopInfo) {
    const result = await this.ShopModel.findOne({
      where: {
        id: shopInfo.id,
      },
    });
    if (!result) return this.ServerResponse.createByErrorMsg('店铺信息未找到');
    const [ updateCount, [ updateRow ]] = await this.ShopModel.update(shopInfo, {
      where: { id: shopInfo.id },
      individualHooks: true,
    });
    const shop = _.pickBy(updateRow.toJSON(), (value, key) => {
      return [ 'id', 'name', 'phone', 'address' ].find(item => key === item);
    });
    if (updateCount > 0) return this.ServerResponse.createBySuccessMsgAndData('更新店铺信息成功', shop);
    return this.ServerResponse.createByError('更新店铺信息失败');
  }

  /**
   * 获取店铺信息
   * @param {String} shopId
   * @return {Promise.<void>}
   */
  async queryShopInfo(shopId) {
    const shop = await this.ShopModel.findOne({
      // attributes: [ 'id', 'username', 'email', 'phone', 'question' ],
      where: shopId,
    });
    if (!shop) return this.ServerResponse.createByErrorMsg('找不到当前店铺');
    return this.ServerResponse.createBySuccessData(shop.toJSON());
  }

  /**
   *
   * @param {经纬度查询附近店铺列表} param0
   */
  async getShopListNearBy({ latitude, longitude, pageNum = 1, pageSize = 10, range = 50000 }) {
    // 距离+排序+多少公里范围的条件检索
    // 默认检索检索出5公里范围
    const queryString = `select * from (select id,address,image_path,promotion_info,phone, startTime, endTime, ROUND(6378.138*2*ASIN(SQRT(POW(SIN((${latitude}*PI()/180-latitude*PI()/180)/2),2)+COS(${latitude}*PI()/180)*COS(latitude*PI()/180)*POW(SIN((${longitude}*PI()/180-longitude*PI()/180)/2),2)))*1000) AS distance from shops order by distance ) as a where a.distance<=${range * 1000} LIMIT ${pageNum},${pageSize}`;
    const [ results ] = await this.app.model.query(queryString);
    const shopList = results.map(row => {
      return {
        ...row,
      };
    });
    return this.ServerResponse.createBySuccessMsgAndData('查询附近店铺成功', shopList);
  }
}

module.exports = ShopService;
