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
    // 店铺存在报错
    const validShopNameResponse = await this.checkValid(SHOPNAME, shop.name);
    if (!validShopNameResponse.isSuccess()) return validShopNameResponse;
    try {
      const { id: userId } = this.session.currentUser;
      shop = { ...shop, userId }
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
  
  async getShopListNearBy({latiude,longitude,pageNum=1, pageSize=10}){
    const { count, rows } = await this.ShopModel.findAndCount({
      // where: { orderNum },
      // order: [['id', 'DESC']],
      limit: Number(pageSize | 0),
      offset: Number(pageNum - 1 | 0) * Number(pageSize | 0),
    });
    if (rows.length < 1) this.ServerResponse.createBySuccessMsg('附近没有店铺');
    const shopList = rows.map(row => row && row.toJSON());
    return this.ServerResponse.createBySuccessData({
      shopList,
      pageNum,
      pageSize,
      total: count,
    });
  }
}

module.exports = ShopService;
