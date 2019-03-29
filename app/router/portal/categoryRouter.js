module.exports = app => {
  const checkLogin = app.middleware.checkLogin({ checkAdmin: false });
  app.router.post('/category/list', checkLogin, app.controller.portal.categoryController.getCategoryInShop);
};
