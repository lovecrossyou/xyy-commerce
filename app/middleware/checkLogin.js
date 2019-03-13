/* eslint-disable no-return-assign */
const { ROLE_ADMAIN } = require('../common/role');

module.exports = options => {
  return async function checkLogin(ctx, next) {
    const tokenString = ctx.request.header.accesstoken;
    if (!tokenString) return ctx.body = ctx.response.ServerResponse.createByErrorCodeMsg(ctx.response.ResponseCode.NEED_LOGIN, '用户未登录');
    // 检查token是否正确
    const tokenInfo = await ctx.model.TokenModel.findOne({
      attributes: [ 'userId' ],
      where: {
        tokenString,
      },
    });
    if (!tokenInfo) return ctx.body = ctx.response.ServerResponse.createByErrorCodeMsg(ctx.response.ResponseCode.NEED_LOGIN, 'token信息失效');
    const user = await ctx.model.UserModel.findOne({
      attributes: [ 'id', 'username', 'email', 'phone', 'role' ],
      where: {
        id: tokenInfo.userId,
      },
    });
    if (!user) return ctx.body = ctx.response.ServerResponse.createByErrorCodeMsg(ctx.response.ResponseCode.NEED_LOGIN, '用户未登录');
    if (options.checkAdmin && user.role !== ROLE_ADMAIN) return ctx.body = ctx.response.ServerResponse.createByErrorCodeMsg(ctx.response.ResponseCode.NO_AUTH, '用户不是管理员无权操作');
    await next();
  };
};
