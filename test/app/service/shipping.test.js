const { app, mock, assert } = require('egg-mock/bootstrap');

describe('login()', () => {
  it('should get exists user', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const response = await ctx.service.shippingService.add('cross', '123456');
    assert(response.data);
    assert(response.data.username === 'cross');
  });
});
