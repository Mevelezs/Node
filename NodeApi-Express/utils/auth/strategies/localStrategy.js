const { Strategy } = require ('passport-local');

const AuthServices = require ('../../../services/authservices');

const service = new AuthServices();

const LocalStrategy = new Strategy({
   usernameField: 'email', // cambio los nombres que vienen por defecto (userneme y password)
   passwordField:'password'
   },
   async (email, password, done ) => {

   try {

      const user = await service.getUser(email, password);
      done(null, user)

      } catch (error) {

         done(error, false);
      }
});

module.exports = LocalStrategy;
