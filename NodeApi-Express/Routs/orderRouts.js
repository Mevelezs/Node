const express = require('express');
const OrderServices = require ('../services/orderServices');

const validatorHandler = require ('../middlawers/validatorHandler');
const { createOrderSchema, getOrderSchema, addItemSchema } = require ('../schemas/orderSchema')

const router = express.Router();
const services = new OrderServices()

router.get('/', async(req, res, next) => {
  try {

    const orders = await services.getAll();
     res.json(orders);

  } catch (error) {

    next(error)
  }
});

router.get('/:id',
  validatorHandler(getOrderSchema, 'params'),
  async(req, res, next) => {
    try {

      const { id } = req.params;
      const order = await services.findOne(id);
      res.json(order);

    } catch (error) {

      next(error);

    }
});

router.post('/',
  validatorHandler(createOrderSchema, 'body'),
  async(req, res, next) => {
    try {

      const body = req.body;
      const newOrder = await services.createOrder(body);
      res.send(newOrder);

    } catch (error) {

      next(error);

    }
});

router.post('/add-items',
  validatorHandler(addItemSchema, 'body'),
  async (req, res, next) => {
    try {

      const body = req.body;
      const newItem = await services.createItem(body);
      res.json(newItem);

    } catch (error) {

      next(error);

    }
  })

router.delete('/:id',
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {

      const { id } = req.params;
      const order = await services.delete(id);
      res.json(order);

    } catch (error) {

      next(error);

    }
});



module.exports = router;
