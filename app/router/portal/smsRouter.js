module.exports = app => {
  //   const checkLogin = app.middleware.checkLogin({});
  app.router.post('/sms/send', app.controller.portal.sMSController.send);

};
