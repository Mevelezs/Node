const express = require ('express');
const passport = require ('passport');

const CategoryServices = require('../services/categoryServices');
const router = express.Router();

const services = new CategoryServices();

const validatorHandler = require('../middlawers/validatorHandler');
const {checkAdminRole , checkRoles }= require ('../middlawers/authHandler')
const {createCategorySchema, getCategorySchema, updateCategorySchema} = require ('../schemas/categorySchema');

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles ('admin', 'customer'),// proteje rutas de forma mas dinamica, pasandole los admitidos
  async( req, res, next ) => {

    try {
      const categories = await services.getAll();
      res.json(categories);

    } catch (error) {

      next(error);

    }
  }
);

router.get('/:id',
  validatorHandler(getCategorySchema, 'params'),
  async(req, res, next) => {

    try {

      const { id } = req.params;
      const category = await services.findOne(id);
      res.json(category);

    } catch (error) {

      next(error);

    }

  }
);

router.post('/',
  passport.authenticate('jwt', {session : false}),
  checkAdminRole, // valida un solo rol
  validatorHandler(createCategorySchema, 'body'),
  async(req, res, next)=>{

    try {

      const body = req.body;
      const categoryCreated = await services.createCategory(body);
      res.json({ message: 'category created',data : categoryCreated });

    } catch (error) {

      next (error);

    }

  }
);

router.patch('/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async(req, res, next)=>{

    try {

      const { id } = req.params;
      const changes = req.body;
      const categorychaged = await services.updateCategory(id, changes);
      res.json(categorychaged);

    } catch (error) {

      next(error);

    }

  }
);

router.delete('/:id',
  validatorHandler(getCategorySchema, 'params'),
  async(req, res, next) => {

    try {

    const { id } = req.params;
    const categoryDeleted = await services.deleteCategory(id);
    res.json({message : 'Category Deleted', data : categoryDeleted});

    } catch (error) {

      next(error)

    }
  }
);

module.exports = router;

