/*
const express = require('express');
const UserServices = require('../services/userServices');

const router = express.Router();

const services = new UserServices();

router.get('/', async(req, res, next) =>{

  try {
    const users = await services.find();
    res.json(users)
  } catch (error) {
    next(error)
  }
})
*/

const express = require('express');
const UserServices = require('../services/userServices');

const router = express.Router();
const validatorHandler = require('../middlawers/validatorHandler')
const {
  createUserSchema,
  getUserSchema,
  updateUserSchema
 } = require('../schemas/userSchemas')

const services = new UserServices();

router.get('/', async (req, res, next) => {

  try {

    const users = await services.getAll();
    res.json(users);

  } catch (error) {
    next(error)
  }
});

router.get('/:id',
validatorHandler(getUserSchema, 'params'),
async(req, res, next) =>{
  try {

    const { id } = req.params;
    const user = await services.findOne(id);
    res.json(user);

  } catch (error) {
    next(error)
  }
});

router.patch('/:id',
validatorHandler(getUserSchema, 'params'),
validatorHandler(updateUserSchema, 'body'),
async(req, res, next) =>{

  try {

    const { id } = req.params;
    const  body  = req.body;
    const userUpdated = await services.update(id, body);
    res.send(userUpdated);

  } catch (error) {

    next(error)
  }
});

router.post ('/',
validatorHandler(createUserSchema, 'body'),
async(req, res, next) =>{
  try {

    const body  = req.body;
    const newUser = await services.createUsers(body);
    res.json(newUser);

  } catch (error) {
    /*res.send(
      {
        message : 'El parámetro ya existe',
        error:error.fields
     }
    )*/ //forma sencilla
    next(error);

  }
})

router.delete('/:id',
validatorHandler(getUserSchema, 'params'),
async(req, res, next) => {
    try {
      const { id } = req.params;
      await services.delete(id);
      res.send(`Deleted id: ${id}`);

    } catch (error) {
      next(error)
    }
});
module.exports = router;
