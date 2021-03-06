'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  require('./router/portal/cartRouter')(app);
  require('./router/portal/userRouter')(app);
  require('./router/portal/orderRouter')(app);
  require('./router/portal/productRouter')(app);
  require('./router/portal/shippingRouter')(app);
  require('./router/portal/mapRouter')(app);
  require('./router/portal/shopRouter')(app);
  require('./router/portal/commentRouter')(app);
  require('./router/portal/categoryRouter')(app);
  require('./router/portal/smsRouter')(app);
  require('./router/portal/pushRouter')(app);


  require('./router/backend/manageRouter')(app);
  require('./router/backend/orderManageRouter')(app);
  require('./router/backend/productManageRouter')(app);
  require('./router/backend/categoryManageRouter')(app);
  require('./router/backend/qiNiuRouter')(app);
  require('./router/backend/shopRouter')(app);
  require('./router/backend/bannerRouter')(app);

};
