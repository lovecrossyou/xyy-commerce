// const { app, mock, assert } = require('egg-mock/bootstrap');

// describe('register()', () => {
//   it('should register shop ok', async () => {
//     const ctx = app.mockContext();
//     ctx.session.id = '8a1a1359-2949-4df0-b8c8-02b96b0e0332';
//     const shopParams = {
//       image_path: '',
//       address: '粮科大厦三层',
//       latitude: 39.92843,
//       longitude: 116.35073,
//       name: '小花的店002',
//       promotion_info: '铺标语铺标语铺标语铺标语',
//       startTime: '05:30',
//       phone: '18610824152',
//       category: 'water',
//       business_license_image: '',
//       catering_service_license_image: '',
//     };

//     const response = await ctx.service.shopService.register(shopParams);
//     assert(response.data.phone === '18610824157');
//   });
// });
