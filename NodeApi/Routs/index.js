const express = require('express');
const productsRouter = require('./productsRouts');
const userRouter = require('./userRouts');
const customerRouter = require('./customerRouts');
const categoryRouter = require('./categoryRouts');
const orderRouter = require('./orderRouts');
const authRouter = require('./authRouts');
const profileRouter = require('./profileRouts')


// function routerApi(app){
//funciona pero queremos hacer una intancia que maneje versiones de la api;
//   app.use('/products', productsRouter);
// }


function routerApi(app) {

  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/products', productsRouter);
  router.use('/users', userRouter);
  router.use('/customers', customerRouter);
  router.use('/categories', categoryRouter);
  router.use('/orders', orderRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
}


module.exports = routerApi;
