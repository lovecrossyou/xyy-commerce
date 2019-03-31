module.exports = app => {
  app.router.post('/sms/create', app.controller.portal.smsController.create);
};
