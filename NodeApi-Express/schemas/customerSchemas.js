const Joi = require('joi');


const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const lastName = Joi.string();
const phone = Joi.string();
const userId = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();

const createCustomerSchema = Joi.object(
  {
     name : name.required(),
     lastName : lastName.required(),
     phone : phone.required(),
     user: Joi.object({
      email: email.required(),
      password: password.required()
    // user :
    })

  }
);

const getCustomerSchema = Joi.object(
  {
    id : id.required()
  }
);

const updateCustomerSchema = Joi.object(
  {
    name : name,
    lastName : lastName,
    phone : phone,
    userId,
  }
);

module.exports = {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema
}
