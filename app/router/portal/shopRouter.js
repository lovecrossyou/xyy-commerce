module.exports = app => {
  //   const checkLogin = app.middleware.checkLogin({});
  app.router.post('/shop/shopListNearBy', app.controller.portal.shopController.shopListNearBy);
};
