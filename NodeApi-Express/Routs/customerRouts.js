const express = require('express');
const CustomerSerivices = require ('../services/customerServices');

const router = express.Router();
const services = new CustomerSerivices();

const validatorHandler = require('../middlawers/validatorHandler');
const {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema
} = require('../schemas/customerSchemas');


router.get('/', async(req, res, next )=> {

  try {

    const data = await services.getAll();
    res.json(data);

  } catch (error) {

    next(error);

  }
});

router.get('/:id',
validatorHandler(getCustomerSchema, 'params'),
async (req, res, next) =>{

   try {

     const { id } = req.params;
     const customer = await services.findOne(id);
     res.json(customer);

   } catch (error) {

     next(error);

   }
});

router.post('/',
validatorHandler(createCustomerSchema, 'body'),
async(req, res, next) => {

  try {

    const data  = req.body;
    const customer = await services.createCustomer(data);
    res.json(customer);

  } catch (error) {

    next(error);

  }
});

router.patch('/:id',
validatorHandler(getCustomerSchema, 'params'),
validatorHandler(updateCustomerSchema, 'body'),
async(req,res, next) => {

  try {

    const { id } = req.params;
    const { changes } = req.body;
    const customerChanged = await services.updateCustomer(id, changes);
    res.json({message: 'customer Changed', data: customerChanged});

  } catch (error) {

    next(error);

  }
});

router.delete('/:id',
validatorHandler(getCustomerSchema, 'params'),
async(req, res, next) => {
  try {

    const { id } = req.params;
    const customerDeleted = await services.deleteCustomer(id);
    res.json({ message : ' Custumer Deleted', data : customerDeleted });

  } catch (error) {

    next(error);

  }
});

module.exports = router;
