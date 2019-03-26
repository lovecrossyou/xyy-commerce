const { app, mock, assert } = require('egg-mock/bootstrap');

describe('login()', () => {
  it('should get exists user', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const response = await ctx.service.userService.login('cross', '123456');
    assert(response.data);
    assert(response.data.username === 'cross');
  });

  it('should get null when user not exists', async () => {
    const ctx = app.mockContext();
    const response = await ctx.service.userService.login('cross1', '123456');
    assert(!response.data);
  });
});

describe('register()', () => {
  it('should get register ok', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const response = await ctx.service.userService.register({
      username: '小王',
      password: '123456',
      email: '111',
      phone: '13220168837',
      question: '',
      answer: '',
    });
    assert(response.data);
    assert(response.data.username === '小王');
  });
});

