const boom = require('@hapi/boom');
const { ValidationError } = require('sequelize')
function error(err, req, res, next){
  console.error(err);
  next(err);// da la orden de que siga al otro middleware.
}


function errorHandler(err, req, res, next) {
  res.status(500).json(
    {
      message: err.message,
      stack: err.stack
    }
  )
}

function boomErrorHandler(err, req, res, next){
  if(err.isBoom){ // si el error es de tipo boom, la librería lo reconoce.
     const { output } = err;// boom guarda toda la info de los errores en el ouput.
     console.log(err)
     res.status(output.statusCode).json(output.payload); // manda el status code y el payload que es la info del error.
  }
  next(err)

}

function ormErrorHandler (err, req, res, next){
   if( err instanceof ValidationError){
    res.status(409).json(
      {
        statusCode:409,
        message: err.name,
        errrors : err.errors
      }
    )
   }
   next(err)
}

module.exports={
  error,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler
}
