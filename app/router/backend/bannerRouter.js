module.exports = app => {
  const checkLogin = app.middleware.checkLogin({ checkAdmin: true });
  app.router.post('/manage/banner/create', app.controller.backend.bannerManageController.create);
  app.router.get('/manage/banner/list', app.controller.backend.bannerManageController.list);
};
