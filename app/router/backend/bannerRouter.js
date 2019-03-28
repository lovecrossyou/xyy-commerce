module.exports = app => {
  const checkLogin = app.middleware.checkLogin({ checkAdmin: true });
  app.router.post('/manage/banner/createOrUpdate', app.controller.backend.bannerManageController.createOrUpdate);
  app.router.get('/manage/banner/list', app.controller.backend.bannerManageController.list);
};
