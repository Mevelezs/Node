const express = require('express');
const ProductsServices = require('./../services/productsServices')
const  validatorHandler = require('./../middlawers/validatorHandler');
const {
  getProductSchema,
  createProductSchema,
  updateProductSchema,
  queryProductSchema
 } = require('../schemas/productsSchemas');

const router = express.Router();

const service = new ProductsServices();

router.get('/',
 validatorHandler(queryProductSchema, 'query'),
 async(req, res, next) => {
  try {

    const products = await service.getAllProducts(req.query)
    res.json(products)

  } catch (error) {

    next (error);

  }

});


router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async(req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error)
    }
  }
);


router.post('/',
  validatorHandler(createProductSchema,'body'),
  async(req, res, next) => {
    try {

      const body = req.body;
      const newProduct = await service.createProduct(body)
      res.json({ message : 'Product Created' , data : newProduct});

    } catch (error) {

      next(error)

    }
  }
);

router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  (req, res, next) => {
    try {
    const { id } = req.params;
    const body = req.body;
      res.json(service.update(id, body))
    } catch (error) {
      next(error)
    }
  }
);

router.delete('/:id',
  validatorHandler(getProductSchema, 'params'),
  (req, res, next) => {
  const { id } = req.params;
  try {

    const productDeleted = service.delete(id);
    res.json({
      productDeleted,
      message : 'Product Deleted'
    })

  } catch (error) {
      next(error)
  }
});


module.exports= router;
