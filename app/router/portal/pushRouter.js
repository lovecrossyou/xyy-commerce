module.exports = app => {
  //   const checkLogin = app.middleware.checkLogin({});
  app.router.post('/push/pushMessage', app.controller.portal.pushController.pushMessage);
  app.router.post('/push/bindUser', app.controller.portal.pushController.bindUser);
};
