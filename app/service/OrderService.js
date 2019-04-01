/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/check-param-names */
/* eslint-disable no-bitwise */
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const qr = require('qr-image');
const alipayf2fConfig = require('../common/alipayConfig');
const wxpayConfig = require('../common/wxpayConfig');
const alipayftof = require('alipay-ftof');
const alipayf2f = new alipayftof(alipayf2fConfig);
const tenpay = require('tenpay');

// 要求在env = test 环境下
process.env.NODE_ENV = 'test';
const Alipay = require('alipay-mobile');
const options = {
  app_id: alipayf2fConfig.appid.toString(),
  appPrivKeyFile: alipayf2fConfig.merchantPrivateKey,
  alipayPubKeyFile: alipayf2fConfig.alipayPublicKey,
};
const alipayService = new Alipay(options);
const wxpayService = new tenpay(wxpayConfig, true);


const OrderStatus = require('../common/orderStatus');
const PayPlatform = require('../common/payPlatform');
const AlipayConst = require('../common/alipayConst');

const { CHECKED } = require('../common/cart');
const { ON_SALE } = require('../common/product');
const { ROLE_ADMAIN } = require('../common/role');
const PAYMENT_TYPE_MAP = require('../common/paymentType');
const ORDER_STATUS_MAP = require('../common/orderStatus');

module.exports = app => {

  return class OrderService extends Service {
    constructor(ctx) {
      super(ctx);
      this.session = ctx.session;
      this.CartModel = ctx.model.CartModel;
      this.OrderModel = ctx.model.OrderModel;
      this.ProductModel = ctx.model.ProductModel;
      this.PayInfoModel = ctx.model.PayInfoModel;
      this.CategoryModel = ctx.model.CategoryModel;
      this.ShippingModel = ctx.model.ShippingModel;
      this.OrderItemModel = ctx.model.OrderItemModel;
      this.ResponseCode = ctx.response.ResponseCode;
      this.ServerResponse = ctx.response.ServerResponse;
      this.ProductModel.hasOne(this.CartModel, { foreignKey: 'id' });
      this.CartModel.belongsTo(this.ProductModel, { foreignKey: 'productId' });

      this.OrderItemModel.hasMany(this.OrderModel, { foreignKey: 'orderNum', targetKey: 'orderNum' });
      this.OrderModel.belongsTo(this.OrderItemModel, { foreignKey: 'orderNum', targetKey: 'orderNum' });

      this.ShippingModel.hasOne(this.OrderModel, { foreignKey: 'id' });
      this.OrderModel.belongsTo(this.ShippingModel, { foreignKey: 'shippingId' });
    }
    /**
     * @feature 生成支付二维码 用到orderNum、userId、qrcode
     * @param orderNum {Number} 订单号
     * @return {Promise.<void>}
     */
    async pay(orderNum) {
      const { id: userId } = this.session.currentUser;
      const order = await this.OrderModel.findOne({ where: { userId, orderNum } }).then(row => row && row.toJSON());
      if (!order) return this.ServerResponse.createByErrorMsg('用户没有该订单');
      if (order.status >= OrderStatus.PAID.CODE) return this.ServerResponse.createByErrorMsg('该订单不可支付');
      // const orderGoodsDetail = await this.OrderItemModel.findAll({ where: { userId, orderNum }}).map(row => row && row.toJSON())

      const result = await alipayf2f.createQRPay(this.alipayData(order));
      console.log('生成支付二维码 result ', result);
      if (result.code !== '10000') return this.ServerResponse.createByErrorMsg('创建支付宝失败');

      const { filename, url } = this.saveQrCode(result);
      return this.ServerResponse.createBySuccessMsgAndData('支付宝二维码生成成功', { filename, url });
    }

    /**
     * @feature 手机支付宝唤醒APP 支付
     * @param orderNum {number}
     * @returns {Promise.<*>}
     */
    async mobilePay(orderNum) {
      // 要求在env = test 环境下
      const { id: userId } = this.session.currentUser;
      const order = await this.OrderModel.findOne({ where: { userId, orderNum } }).then(row => row && row.toJSON());
      if (!order) return this.ServerResponse.createByErrorMsg('用户没有该订单');
      if (order.status >= OrderStatus.PAID.CODE) return this.ServerResponse.createByErrorMsg('该订单不可支付');

      const data = {
        subject: `COOLHEADEDYANG扫码支付,订单号: ${order.orderNum}`,
        out_trade_no: order.orderNum.toString(),
        total_amount: order.payment,
        // body: `订单${order.orderNum}购买商品共${order.payment}元`
      };
      // const basicParams = { return_url: 'http://localhost:7071', notify_url: alipayf2fConfig.notifyUrl };
      const result = await alipayService.createOrder(data);
      if (result.code !== 0) return this.ServerResponse.createByErrorMsg('创建支付订单错误');
      console.log(result.data);
      return this.ServerResponse.createBySuccessMsgAndData('支付宝手机支付地址创建成功', result);
    }

    /**
     *
     * @param {微信支付} orderNum
     */
    async wxpay(orderNum, trade_type = '') {
      const { id: userId, openid } = this.session.currentUser;
      const order = await this.OrderModel.findOne({ where: { userId, orderNum } }).then(row => row && row.toJSON());
      if (!order) return this.ServerResponse.createByErrorMsg('用户没有该订单');
      if (order.status >= OrderStatus.PAID.CODE) return this.ServerResponse.createByErrorMsg('该订单不可支付');

      try {
        let result = null;
        let prepay_id = 0;
        if (trade_type !== 'APP') {
          result = await wxpayService.getPayParams({
            out_trade_no: order.orderNum.toString(),
            body: `订单${order.orderNum}购买商品共${order.payment}元`,
            total_fee: Math.round(Number(order.payment) * 100, 0),
            openid,
          });
          const result_package = result.package;
          prepay_id = result_package.split('=')[1];
          result = await wxpayService.getPayParamsByPrepay({ prepay_id });
        } else {
          result = await wxpayService.unifiedOrder({
            out_trade_no: order.orderNum.toString(),
            body: `订单${order.orderNum}购买商品共${order.payment}元`,
            total_fee: Math.round(Number(order.payment) * 100, 0),
            trade_type, // APP
          });
          prepay_id = result.prepay_id;
          result = await wxpayService.getAppParamsByPrepay({ prepay_id });
        }
        return new Promise(resolve => {
          const resData = this.ServerResponse.createBySuccessMsgAndData('生成微信支付信息成功', result);
          resolve(resData);
        });
      } catch (error) {
        return this.ServerResponse.createByErrorMsg('创建支付订单错误');
      }
    }


    /**
     * @feature 处理支付宝支付回调
     * @param body {Object} 支付宝支付回调的请求body
     * @return {Promise.<*>}
     */
    async alipayCallback(body) {
      const signStatus = alipayf2f.verifyCallback(body);
      if (!signStatus) return this.ServerResponse.createByErrorMsg('非法请求验证不通过');
      // TODO 处理支付回调 1更新订单状态 2判断支付状态
      const { /* 支付宝支付状态*/
        trade_status: tradeStatus,
        /* 支付宝外部订单号 === 我们的订单号*/
        out_trade_no: orderNum,
        /* 支付宝内部订单号*/
        trade_no: tradeNo,
        /* 支付宝支付时间*/
        gmt_payment: paymentTime } = body;
      const orderRow = await this.OrderModel.findOne({ where: { orderNum } });
      if (!orderRow) return this.ServerResponse.createByErrorMsg('非本系统支付单，回调忽略');
      const order = orderRow.toJSON();
      if (order.status >= OrderStatus.PAID.CODE) return this.ServerResponse.createBySuccessMsg('支付宝支付重复调用');

      if (tradeStatus === AlipayConst.TRADE_SUCCESS) await orderRow.update({ status: OrderStatus.PAID.CODE, paymentTime }, { individualHooks: true });
      return this.createPayInfo(order.userId, order.orderNum, PayPlatform.ALIPAY.CODE, tradeNo, tradeStatus);
    }

    /**
     *
     * @param {微信支付回调} body
     */
    async wxpayCallback(body) {
      if (!body) return this.ServerResponse.createByErrorMsg('非法请求验证不通过');
      const { result_code, return_code, out_trade_no, openid, transaction_id } = body;
      if (result_code === 'SUCCESS' && return_code === 'SUCCESS') { // 验证 是否 微信 回调
        // 是否是真实的订单
        const isRealOrder = true;
        if (isRealOrder) {
          // 微信支付回调更新订单支付状态，更新订单支付状态成功，订单号
        } else {
          // 微信支付回调更新订单支付状态，更新订单支付状态失败，订单号
        }
      } else {
        return this.ServerResponse.createByErrorMsg('微信支付回调参数非法');
      }
    }

    // 微信支付 查询订单
    // let result = await api.orderQuery({
    //   // transaction_id, out_trade_no 二选一
    //   // transaction_id: '微信的订单号',
    //   out_trade_no: '商户内部订单号'
    // });

    // 微信支付 撤销订单
    // let result = await api.reverse({
    //   // transaction_id, out_trade_no 二选一
    //   // transaction_id: '微信的订单号',
    //   out_trade_no: '商户内部订单号'
    // });

    // 微信支付 关闭订单
    // let result = await api.closeOrder({
    //   out_trade_no: '商户内部订单号'
    // });

    // 微信支付 申请退款
    // let result = await api.refund({
    //   // transaction_id, out_trade_no 二选一
    //   // transaction_id: '微信的订单号',
    //   out_trade_no: '商户内部订单号',
    //   out_refund_no: '商户内部退款单号',
    //   total_fee: '订单金额(分)',
    //   refund_fee: '退款金额(分)'
    // });

    // 微信支付 查询退款
    // let result = await api.refundQuery({
    //   // 以下参数 四选一
    //   // transaction_id: '微信的订单号',
    //   // out_trade_no: '商户内部订单号',
    //   // out_refund_no: '商户内部退款单号',
    //   refund_id: '微信退款单号'
    // });
    // 微信支付 发放代金券
    // let result = await api.sendCoupon({
    //   coupon_stock_id: '代金券批次id',
    //   partner_trade_no: '商户单据号',
    //   openid: '用户openid'
    // });

    /**
     * @feature 查询订单状态
     * @param orderNum {Number} 订单号
     * @return {Promise.<*>}
     */
    async queryOrderPayStatus(orderNum) {
      const { id: userId } = this.session.currentUser;
      const order = await this.OrderModel.findOne({ where: { userId, orderNum } }).then(row => row && row.toJSON());
      if (!order) return this.ServerResponse.createByErrorMsg('用户不存在该订单');
      const key = Object.keys(OrderStatus).find(k => OrderStatus[k].CODE === order.status);

      return this.ServerResponse.createBySuccessMsgAndData('订单状态', OrderStatus[key]);
    }

    /**
     * 创建 基于店铺的订单
     * @param {*} shopId
     * @param {*} shippingId
     */
    async createShopOrder(shopId, shippingId) {
      const { id: userId } = this.session.currentUser;
      const shipping = await this.ShippingModel.findOne({ where: { id: shippingId, userId } }).then(r => r && r.toJSON());
      if (!shipping) return this.ServerResponse.createByErrorMsg('用户无该收货地址');
      // 店铺购物车中获取数据
      const response = await this._getShopCartListWithProduct(shopId, userId);
      if (!response.isSuccess()) return response;
      const cartListWithProduct = response.getData();

      const orderNum = this._createAOrderNum();
      const orderItemArr = await this._cartListToOrderItemArr(cartListWithProduct);
      const orderTotalPrice = orderItemArr.reduce((total, item) => total + item.totalPrice, 0);
      const order = await this._createPayOrder(userId, shippingId, orderTotalPrice, orderNum);
      if (!order) return this.ServerResponse.createByErrorMsg('创建订单错误');
      // 批量插入orderItem
      const orderItemList = await this._bulkCreateOrderItemArr(orderItemArr, orderNum);
      // 更新库存
      await this._reduceUpdateProductStock(orderItemList);
      // 清空购物车[]
      await this._cleanCart(cartListWithProduct);

      // 组装及处理返回数据， 返回订单详情，收货地址，订单的各产品
      const orderDetail = await this._createOrderDetail(order, orderItemList, shippingId);
      return this.ServerResponse.createBySuccessMsgAndData('创建订单成功', orderDetail);

    }

    async createOrder(shippingId) {
      const { id: userId } = this.session.currentUser;
      const shipping = await this.ShippingModel.findOne({ where: { id: shippingId, userId } }).then(r => r && r.toJSON());
      if (!shipping) return this.ServerResponse.createByErrorMsg('用户无该收货地址');
      // 购物车中获取数据
      const response = await this._getCartListWithProduct(userId);
      if (!response.isSuccess()) return response;
      const cartListWithProduct = response.getData();

      const orderNum = this._createAOrderNum();
      const orderItemArr = await this._cartListToOrderItemArr(cartListWithProduct);
      const orderTotalPrice = orderItemArr.reduce((total, item) => total + item.totalPrice, 0);
      const order = await this._createPayOrder(userId, shippingId, orderTotalPrice, orderNum);
      if (!order) return this.ServerResponse.createByErrorMsg('创建订单错误');
      // 批量插入orderItem
      const orderItemList = await this._bulkCreateOrderItemArr(orderItemArr, orderNum);
      // 更新库存
      await this._reduceUpdateProductStock(orderItemList);
      // 清空购物车[]
      await this._cleanCart(cartListWithProduct);

      // 组装及处理返回数据， 返回订单详情，收货地址，订单的各产品
      const orderDetail = await this._createOrderDetail(order, orderItemList, shippingId);
      return this.ServerResponse.createBySuccessMsgAndData('创建订单成功', orderDetail);
    }

    /**
     * @feature 取消订单
     * @param orderNum {number} 订单号
     * @returns {Promise.<object>}
     */
    async cancel(orderNum) {
      const { id: userId } = this.session.currentUser;
      const orderRow = await this.OrderModel.findOne({ where: { userId, orderNum } });
      if (!orderRow) return this.ServerResponse.createByErrorMsg('用户不存在该订单');
      if (orderRow.get('status') !== ORDER_STATUS_MAP.NO_PAY.CODE) return this.ServerResponse.createByErrorMsg('订单无法取消');
      const updateRow = await orderRow.update({ status: ORDER_STATUS_MAP.CANCELED.CODE, closeTime: new Date() }, { individualHooks: true });
      if (!updateRow) return this.ServerResponse.createByErrorMsg('取消订单失败');
      return this.ServerResponse.createBySuccessMsgAndData('取消订单成功', updateRow.toJSON());
    }

    /**
     * @feature 查看选中购物车的订单快照
     * @returns {Promise.<*>}
     */
    async getOrderCartProduct() {
      const { id: userId } = this.session.currentUser;
      // 购物车中获取数据
      const response = await this._getCartListWithProduct(userId);
      if (!response.isSuccess()) return response;
      const cartListWithProduct = response.getData();

      const orderItemArr = await this._cartListToOrderItemArr(cartListWithProduct);
      const orderTotalPrice = orderItemArr.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
      return this.ServerResponse.createBySuccessMsgAndData('订单快照', { orderItemArr, orderTotalPrice, host: 'localhost:7071' });
    }

    /**
     * @feature 获取订单详情
     * @param orderNum {number} 订单号
     * @returns {Promise.<object>}
     */
    async getDetail(orderNum) {
      const { id: userId, role } = this.session.currentUser;
      const order = await this.OrderModel.findOne({ where: { orderNum, userId: role === ROLE_ADMAIN ? { $regexp: '[0-9a-zA-Z]' } : userId } }).then(r => r && r.toJSON());
      if (!order) return this.ServerResponse.createByErrorMsg('订单不存在');
      const orderItem = await this.OrderItemModel.findAll({ where: { orderNum, userId: role === ROLE_ADMAIN ? { $regexp: '[0-9a-zA-Z]' } : userId } }).then(rows => rows && rows.map(r => r.toJSON()));
      if (orderItem.length < 1) return this.ServerResponse.createByErrorMsg('订单不存在');
      const orderDetail = await this._createOrderDetail(order, orderItem, order.shippingId);
      return this.ServerResponse.createBySuccessMsgAndData('订单详情', orderDetail);
    }

    async manageSendGood(orderNum) {
      const orderRow = await this.OrderModel.findOne({ where: { orderNum } });
      if (!orderRow) return this.ServerResponse.createByErrorMsg('订单不存在1');

      const orderItem = await this.OrderItemModel.findAll({ where: { orderNum } }).then(rows => rows && rows.map(r => r.toJSON()));
      if (orderItem.length < 1) return this.ServerResponse.createByErrorMsg('订单不存在2');

      if (orderRow.get('status') !== ORDER_STATUS_MAP.PAID.CODE) return this.ServerResponse.createByErrorMsg('此订单未完成交易, 不能发货');
      const updateRow = await orderRow.update({ status: ORDER_STATUS_MAP.SHIPPED.CODE, sendTime: new Date() }, { individualHooks: true });
      if (!updateRow) return this.ServerResponse.createByErrorMsg('订单发货失败');


      const orderDetail = await this._createOrderDetail(updateRow.toJSON(), orderItem, updateRow.get('shippingId'));
      return this.ServerResponse.createBySuccessMsgAndData('发货成功', orderDetail);
    }

    /**
     * @feature 获取订单详情列表
     * @param pageNum {number}
     * @param pageSize {number}
     * @returns {Promise.<array>}
     */
    async getList({ pageNum = 1, pageSize = 10 }) {
      const { id: userId, role } = this.session.currentUser;
      // 循环查询解决
      const { count, rows } = await this.OrderModel.findAndCount({
        where: { userId: role === ROLE_ADMAIN ? { $regexp: '[0-9a-zA-Z]' } : userId },
        order: [[ 'id', 'DESC' ]],
        // eslint-disable-next-line no-bitwise
        limit: Number(pageSize | 0),
        offset: Number(pageNum - 1 | 0) * Number(pageSize | 0),
      });
      if (rows.length < 1) this.ServerResponse.createBySuccessMsg('已无订单数据');
      const orderList = rows.map(row => row && row.toJSON());

      const orderListWithOrderItemsAndShipping = await Promise.all(orderList.map(async item => {
        const orderItemList = await this.OrderItemModel.findAll({ where: { orderNum: item.orderNum } }).then(rows => rows && rows.map(r => r.toJSON()));
        const shipping = await this.ShippingModel.findOne({ where: { id: item.shippingId } }).then(r => r && r.toJSON());

        return { ...item, orderItemList, shipping };
      }));
      const list = this._createOrderDetailList(orderListWithOrderItemsAndShipping);
      return this.ServerResponse.createBySuccessData({
        list,
        pageNum,
        pageSize,
        total: count,
        // host: this.config.oss.client.endpoint,
      });
    }

    /**
     * @feature 后台管理搜索, 现只支持订单号搜索
     * @param orderNum {number}
     * @param pageNum {number}
     * @param pageSize {number}
     * @returns {Promise.<array>}
     */
    async search({ orderNum, pageNum = 1, pageSize = 10 }) {
      const { count, rows } = await this.OrderModel.findAndCount({
        where: { orderNum },
        order: [[ 'id', 'DESC' ]],
        limit: Number(pageSize | 0),
        offset: Number(pageNum - 1 | 0) * Number(pageSize | 0),
      });
      if (rows.length < 1) this.ServerResponse.createBySuccessMsg('已无订单搜索数据');
      const orderList = rows.map(row => row && row.toJSON());

      const orderListWithOrderItemsAndShipping = await Promise.all(orderList.map(async item => {
        const orderItemList = await this.OrderItemModel.findAll({ where: { orderNum: item.orderNum } }).then(rows => rows && rows.map(r => r.toJSON()));
        const shipping = await this.ShippingModel.findOne({ where: { id: item.shippingId } }).then(r => r && r.toJSON());

        return { ...item, orderItemList, shipping };
      }));

      const list = this._createOrderDetailList(orderListWithOrderItemsAndShipping);

      return this.ServerResponse.createBySuccessData({
        list,
        pageNum,
        pageSize,
        total: count,
        // host: this.config.oss.client.endpoint,
      });
    }

    // 对order 组装orderItem 数组
    _groupList(arr) {
      return arr.reduce((arr, item, index) => {
        item.orderItemList = [];
        if (!arr[index - 1]) item.orderItemList.push(item.orderItem);
        else {
          if (arr[index - 1].orderItem.orderNum === item.orderItem.orderNum) {
            arr[index - 1].orderItemList.push(item.orderItem);
            _.unset(arr[index - 1], 'orderItem');
            return arr;
          }
        }
        return [ ...arr, item ];
      }, []);
    }

    /**
     * @feature 补全订单列表详情数据， 关联查询已经携带orderLIst shipping
     * @param list {array} 订单列表，包含orderItem shipping
     * @returns {Array|*|{}}
     * @private
     */
    _createOrderDetailList(list) {
      return list.map(order => {
        const paymentType = this._getEnumValueByCode(PAYMENT_TYPE_MAP, order.paymentType);
        const orderStatus = this._getEnumValueByCode(ORDER_STATUS_MAP, order.status);
        return { ...order, payment: Number(order.payment).toFixed(2), paymentType, orderStatus };
      });
    }

    /**
     * @feature 组装及处理订单详情
     * @param order {object}
     * @param orderItemList {array}
     * @param shippingId {number}
     * @returns {Promise.<{order: {paymentType: (string|string|string|string|string|string|*), orderStatus: (string|string|string|string|string|string|*)}, orderItemList: *, shipping: TResult, host: string}>}
     * @private
     */
    async _createOrderDetail(order, orderItemList, shippingId) {
      let shipping;
      if (shippingId) shipping = await this.ShippingModel.findOne({ where: { id: shippingId } }).then(r => r && r.toJSON());

      const paymentType = this._getEnumValueByCode(PAYMENT_TYPE_MAP, order.paymentType);
      const orderStatus = this._getEnumValueByCode(ORDER_STATUS_MAP, order.status);

      return { order: { ...order, payment: Number(order.payment).toFixed(2), paymentType, orderStatus }, orderItemList, shipping, host: 'localhost:7071' };
    }

    _getEnumValueByCode(mapper, code) {
      return mapper[_.findKey(mapper, item => item.CODE === code)].VALUE;
    }

    /**
     * 获取店铺购物车商品
     * @param {*} shopId
     * @param {*} userId
     */
    async _getShopCartListWithProduct(shopId, userId) {
      const arr = await this.CartModel.findAll({
        where: { userId, shopId, checked: CHECKED },
        include: [{ model: this.ProductModel, where: { id: app.Sequelize.col('productId'), status: ON_SALE.CODE } }],
      }).then(rows => rows && rows.map(r => r.toJSON()));

      if (arr.length === 0) return this.ServerResponse.createByErrorMsg('购物车为空');
      if (!this._checkStock(arr).hasStock) return this.ServerResponse.createByErrorMsg(`${this._checkStock(arr).noStockList[0]}商品库存不足`);
      return this.ServerResponse.createBySuccessData(arr);
    }

    async _getCartListWithProduct(userId) {
      const arr = await this.CartModel.findAll({
        where: { userId, checked: CHECKED },
        include: [{ model: this.ProductModel, where: { id: app.Sequelize.col('productId'), status: ON_SALE.CODE } }],
      }).then(rows => rows && rows.map(r => r.toJSON()));

      if (arr.length === 0) return this.ServerResponse.createByErrorMsg('购物车为空');
      if (!this._checkStock(arr).hasStock) return this.ServerResponse.createByErrorMsg(`${this._checkStock(arr).noStockList[0]}商品库存不足`);
      return this.ServerResponse.createBySuccessData(arr);
    }

    // 清空购物车
    async _cleanCart(cartList) {
      cartList.forEach(async item => {
        await this.CartModel.destroy({ where: { id: item.id } });
      });
    }

    // 批量更新库存
    async _reduceUpdateProductStock(orderItemList) {
      orderItemList.forEach(async item => {
        await this.ProductModel.update({ stock: app.Sequelize.literal(`stock - ${item.quantity}`) }, { where: { id: item.productId } });
      });
    }

    async _bulkCreateOrderItemArr(orderItemArr, orderNum) {
      orderItemArr = orderItemArr.map(item => ({ ...item, orderNum }));
      return await this.OrderItemModel.bulkCreate(orderItemArr).then(rows => rows && rows.map(r => r.toJSON()));
    }

    _createAOrderNum() {
      const orderNum = Date.now() + _.random(100);
      return orderNum;
    }
    /**
     * @feature 创建最终支付订单
     * @param userId {number}
     * @param shippingId {number} 收货地址
     * @param payment {string} 支付总价
     * @returns {Promise.<TResult>}
     */
    async _createPayOrder(userId, shippingId, payment, orderNum) {
      const order = {
        userId,
        payment,
        orderNum,
        shippingId,
      };
      // 发货时间，支付时间
      const result = await this.OrderModel.create(order).then(r => r && r.toJSON());
      if (!result) return null;
      return result;
    }

    /**
     * @feature 创建OrderItems 快照
     * @param cartList
     * @returns {Promise.<TResult>}
     */
    async _cartListToOrderItemArr(cartList) {
      return cartList.map(item => ({
        userId: item.userId,
        quantity: item.quantity,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.mainImage,
        currentUnitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
      }));
    }

    // 生成支付信息
    alipayData(order) {
      const tradeNo = order.orderNum,
        subject = `COOLHEADEDYANG扫码支付,订单号: ${tradeNo}`,
        totalAmount = order.payment,
        body = `订单${tradeNo}购买商品共${totalAmount}元`;
      return { tradeNo, subject, totalAmount, body };
    }

    /**
     * @feature 生成二维码并保存，返回二维码地址
     * @param result {Object}
     * @return {{filename: string, url: string}}
     */
    saveQrCode(result) {
      const imgStream = qr.image(result.qr_code, { size: 10 });
      const filename = 'qr_order_' + result.out_trade_no + 'timestamps_' + Date.now() + '.png';
      const ws = fs.createWriteStream(path.resolve('app/public/' + filename));
      imgStream.pipe(ws);
      const url = 'localhost:7001/public/' + filename;
      return { filename, url };
    }

    /**
     * @feature 生成一个支付信息并存库
     * @param userId
     * @param orderNum
     * @param payPlatform
     * @param platformNumber
     * @param platformStatus
     * @return {Promise.<*>}
     */
    async createPayInfo(userId, orderNum, payPlatform, platformNumber, platformStatus) {
      // TODO 创建payInfo
      const payInfo = { userId, orderNum, payPlatform, platformNumber, platformStatus };
      const payInfoRow = await this.PayInfoModel.create(payInfo);
      app.logger.info(`\n创建支付信息\n${JSON.stringify(payInfoRow.toJSON())}`);
      return this.ServerResponse.createBySuccess();
    }

    // 检查库存
    _checkStock(list) {
      const arr = [];
      list.forEach(item => {
        if (item.product.stock < item.quantity) {
          arr.push(item.product.name);
        }
      });
      return { hasStock: arr.length === 0, noStockList: arr };
    }
  };
};
