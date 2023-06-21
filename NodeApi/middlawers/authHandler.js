const boom = require ('@hapi/boom');
const { config } = require('dotenv');

function checkApiKey (req, res, next){
  const apiKey = req.headers['api']; // permite capturar el atriduto api desde los headers
  if(apiKey === config.apiKey){
    next();
  }else {
    next(boom.unauthorized());
  }
}

function checkAdminRole(req, res, next){
    const user = req.user;
    console.log(req.user);

    if (user.role === 'admin') {
        next();
    } else {
        next(boom.unauthorized())
    }

};

function checkRoles(...roles) {
   return (req, res, next) =>{
       const user = req.user
       if (roles.includes(user.role)) {
           next();
       } else {
           next(boom.unauthorized())
       }
   }
};


module.exports = {checkApiKey ,checkAdminRole, checkRoles};
