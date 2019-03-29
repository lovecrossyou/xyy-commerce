'use strict';

const Service = require('egg').Service;

class CommentService extends Service {

  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.CommentModel = ctx.model.CommentModel;
    this.ProductModel = ctx.model.ProductModel;
    this.OrderModel = ctx.model.OrderModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   *
   * @param {评论} params
   */
  async create(params) {
    if (!params) return this.ServerResponse.createByErrorMsg('参数有误');
    try {
      const { goods_id = 0, order_id = 0, supplier_comment_grade = 5, goods_comment_grade = 5, goods_comment_content = '默认好评' } = params;
      const { id: userId } = this.session.currentUser;

      const productRow = await this.ProductModel.findOne({ where: { id: goods_id } });
      if (!productRow) return this.ServerResponse.createByErrorMsg('商品不存在');

      const orderRow = await this.OrderModel.findOne({ where: { id: order_id } });
      if (!orderRow) return this.ServerResponse.createByErrorMsg('订单不存在');

      params = {
        goods_id,
        order_id,
        supplier_comment_grade,
        goods_comment_grade,
        goods_comment_content,
        userId,
      };

      const commentRow = await this.CommentModel.create(params);
      if (!commentRow) return this.ServerResponse.createByErrorMsg('评价失败');
      return this.ServerResponse.createBySuccessMsgAndData('评价成功', commentRow);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('评价失败');
    }
  }

  /**
   * 获取商品的评价列表
   */
  async list(goods_id = 0) {
    const commentsRow = await this.CommentModel.findAll({ where: { goods_id } }).map(rows => rows && rows.toJSON());
    if (!commentsRow) return this.ServerResponse.createByErrorMsg('查询错误');
    return this.ServerResponse.createBySuccessMsgAndData('查询成功', commentsRow);
  }
}

module.exports = CommentService;
