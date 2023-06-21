// se crean middlewarer para la validación de la data que viene de schema
const boom = require("@hapi/boom");

function validatorHandler(schema, property){
  return (req, res, next) => { // clousure que crea y retorna middlewares

    const data = req[property];
    const { error } = schema.validate(data, { abortEarly : false});// el segundo argumeto es para que mande todos los errores en un solo mensaje.

    if(error){

      next(boom.badRequest(error));
    }
    next();
  }
}


module.exports = validatorHandler;
