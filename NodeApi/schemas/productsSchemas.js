//validando toda la data con  joi,
// la version posterior de joi se rompio

const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().alphanum().min(5).max(15);
const price = Joi.number().integer().min(10);
const image = Joi.string().uri();
const description = Joi.string().min(10);
const categoryId = Joi.number().integer();


const limit = Joi.number().integer();
const offset = Joi.number().integer();

const price_min = Joi.number().integer().min(10);
const price_max = Joi.number().integer();



const createProductSchema = Joi.object(
  {
    name:name.required(),
    price:price.required(),
    image:image.required(),
    description: description.required(),
    categoryId : categoryId.required()
  }
);

const updateProductSchema = Joi.object(
  {
    name: name,
    price: price,
    image: image,
    description,
    categoryId
  }
);

const getProductSchema = Joi.object(
  {
    id: id.required(),
  }
);

const queryProductSchema = Joi.object({
  limit,
  offset,
  price,
  price_min,
  price_max : price_max.when('price_min', {// se valida max siempre y cuando se haya enviado min
    is : Joi.number().integer(),
    then : Joi.required()
  })
});

module.exports ={
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  queryProductSchema
}
