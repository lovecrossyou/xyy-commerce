/* eslint-disable no-bitwise */
/* eslint-disable jsdoc/check-param-names */
const Service = require('egg').Service;
const _ = require('lodash');
const { SHOPNAME } = require('../common/type');
const { ON_SALE } = require('../common/product');


class ShopService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.ShopModel = ctx.model.ShopModel;
    this.ProductModel = ctx.model.ProductModel;
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
   * 获取店铺信息 包含在售商品
   * @param {String} shopId
   * @return {Promise.<void>}
   */
  async queryShopInfo({ shopId, status = ON_SALE.CODE }) {
    const shop = await this.ShopModel.findOne({
      // attributes: [ 'id', 'username', 'email', 'phone', 'question' ],
      where: { id: shopId },
    });
    if (!shop) return this.ServerResponse.createByErrorMsg('找不到当前店铺');

    const products = await this.ProductModel.findAll({ where: { shopId, status } });

    const groupedProducts = _(products)
      .groupBy(item => { return JSON.stringify({ categoryName: item.categoryName, categoryId: item.id }); })
      .map((items, categoryString) => {
        const categoryInfo = JSON.parse(categoryString);
        return {
          categoryName: categoryInfo.categoryName,
          categoryId: categoryInfo.categoryId,
          items,
        };
      })
      .reverse() // 为了反转数组排序
      .value();


    if (!products) return this.ServerResponse.createByErrorMsg('查询商品出错');
    return this.ServerResponse.createBySuccessData({
      shopInfo: shop,
      list: groupedProducts,
    });
  }

  /**
   *
   * @param {经纬度查询附近店铺列表} param0
   */
  async getShopListNearBy({ latitude, longitude, pageNum = 1, pageSize = 10, range = 5 }) {
    // 距离+排序+多少公里范围的条件检索
    // 默认检索检索出5公里范围
    const lat2 = latitude;
    const lng2 = longitude;
    const queryString = `select * from (select id,name,image_path,address,category,promotion_info,phone, round(6378.138*2*asin(sqrt(pow(sin((latitude*pi()/180-${lat2}*pi()/180)/2),2)+cos(latitude*pi()/180)*cos(${lat2}*pi()/180)* pow(sin((longitude*pi()/180-${lng2}*pi()/180)/2),2)))*1000) as distance from shops order by distance ) as a where a.distance<=${range * 1000} LIMIT ${pageNum - 1},${pageSize}`;
    const [ results ] = await this.app.model.query(queryString);
    const shopList = results.map(row => {
      return {
        ...row,
      };
    });
    // const shopList = await this.ShopModel.findAll();
    return this.ServerResponse.createBySuccessMsgAndData('查询附近店铺成功', shopList);
  }
}

module.exports = ShopService;
