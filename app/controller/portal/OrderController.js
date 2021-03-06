// eslint-disable-next-line strict
const Controller = require('egg').Controller;
const _ = require('lodash');

class OrderController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.request = ctx.request;
    this.UserService = ctx.service.userService;
    this.OrderService = ctx.service.orderService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ProductService = ctx.service.productService;
    this.ServerResponse = ctx.response.ServerResponse;
    this.ShippingService = ctx.service.shippingService;
  }

  async pay() {
    const { orderNum } = this.request.body;
    const response = await this.OrderService.pay(orderNum);
    this.ctx.body = response;
  }

  async mobilePay() {
    const { orderNum } = this.request.body;
    const response = await this.OrderService.mobilePay(orderNum);
    this.ctx.body = response;
  }

  async queryOrderPayStatus() {
    const { orderNum } = this.request.query;
    const response = await this.OrderService.queryOrderPayStatus(orderNum);
    this.ctx.body = response;
  }

  async alipayCallback() {
    // 验证回调是否为支付宝发起，避免重复
    const body = this.ctx.request.body;
    const response = await this.OrderService.alipayCallback(body);
    this.ctx.body = response;
  }

  // 微信支付回调
  async wxpayCallback() {
    // 验证回调是否为支付宝发起，避免重复
    const body = this.ctx.request.body;
    const response = await this.OrderService.wxpayCallback(body);
    this.ctx.body = response;
  }

  async create() {
    const { shippingId } = this.request.body;
    const response = await this.OrderService.createOrder(shippingId);
    this.ctx.body = response;
  }

  /**
   * 创建单店铺订单
   */
  async createShop() {
    const { shippingId, shopId } = this.request.body;
    const response = await this.OrderService.createShopOrder(shopId, shippingId);
    this.ctx.body = response;
  }
  

  async cancel() {
    const { orderNum } = this.request.body;
    const response = await this.OrderService.cancel(orderNum);
    this.ctx.body = response;
  }

  async getOrderCartProduct() {
    // 获取购物车中已经选中的商品详情
    const response = await this.OrderService.getOrderCartProduct();
    this.ctx.body = response;
  }

  async list() {
    const response = await this.OrderService.getList(this.request.query);
    this.ctx.body = response;
  }

  async detail() {
    const { orderNum } = this.request.query;
    const response = await this.OrderService.getDetail(orderNum);
    this.ctx.body = response;
  }

  async openId() {
    const { code } = this.request.query;
    console.log('code ## ', code);
    this.ctx.body = await this.OrderService.openId(code);
  }

  /**
   * 微信支付
   */
  async wxpay() {
    const { orderNum } = this.request.body;
    const response = await this.OrderService.wxpay(orderNum);
    this.ctx.body = response;
  }
}

module.exports = OrderController;
