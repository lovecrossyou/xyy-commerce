module.exports = app => {
  const checkLogin = app.middleware.checkLogin({ checkAdmin: true });
  app.router.post('/manage/shop/create', app.controller.backend.shopController.create);
  app.router.post('/manage/shop/queryShopInfo', app.controller.backend.shopController.queryShopInfo);
  app.router.post('/manage/shop/updateShopInfo', app.controller.backend.shopController.update);

};

