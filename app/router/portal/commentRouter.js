module.exports = app => {
  //   const checkLogin = app.middleware.checkLogin({});
  app.router.post('/comment/create', app.controller.portal.commentController.create);
  app.router.post('/comment/list', app.controller.portal.commentController.list);
};
