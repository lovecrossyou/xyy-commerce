module.exports = app => {
  //   const checkLogin = app.middleware.checkLogin({});
  app.router.post('/sms/create', app.controller.portal.sMSController.create);

};
