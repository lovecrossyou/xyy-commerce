module.exports = app => {
  const checkLogin = app.middleware.checkLogin({ checkAdmin: true });
  app.router.post('/manage/qiniu/upload', app.controller.backend.qiNiuController.upload);
};

