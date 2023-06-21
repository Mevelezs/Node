const Joi = require('joi');
// const { joiPasswordExtendCore } =  require ('joi-password');
// const JoiPassword = Joi.extend(joiPasswordExtendCore);

const id = Joi.number();
const email = Joi.string().email();
const password = Joi.string()
  // .minOfSpecialCharacters(2)
  // .minOfLowercase(2)
  // .minOfUppercase(2)
  // .minOfNumeric(2)
  // .noWhiteSpaces();
const role = Joi.string().min(5);


const createUserSchema = Joi.object (
  {
    password:password.required(),
    email: email.required(),
    role: role
  }
);

const getUserSchema = Joi.object(
  {
    id:id.required()
  }
);

const updateUserSchema = Joi.object(
  {
    password:password,
    email:email,
    role:role
  }
);

module.exports = {
  createUserSchema,
  getUserSchema,
  updateUserSchema
}



