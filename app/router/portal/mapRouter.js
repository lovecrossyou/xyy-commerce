module.exports = app => {
//   const checkLogin = app.middleware.checkLogin({});
  app.router.post('/map/search', app.controller.portal.mapController.search);
};

