const bcrypt = require ('bcrypt');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const UserServices = require('./userServices');

const { config } = require ('../config/config');

const service = new UserServices ();

class AuthServices {

    async getUser(email, password){

        const user = await service.findByEmail(email);

        if (!user) {
            throw boom.unauthorized();
           };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw boom.unauthorized();
        };

        delete user.dataValues.password;
        return user;
   };

   async singToken (user){
       const payload = {
           sub: user.id,
           role: user.role
       }
       const token = jwt.sign(payload, config.jwtSecret);
       return { user, token }
   };

  async sendRecovery (email){
      const user = await service.findByEmail(email);

      if (!user) {
        throw boom.unauthorized();
      };
     const payload = { sub : user.id };
     const token = jwt.sign(payload, config.jwtSecret, {expiresIn : '15min'});
     const link = `http://my-forntend.com/recovery?token=${token}`
     await service.update(user.id, {recoveryToken : token})
     const mail = {
        from: config.email, // sender address
        to: `${user.email}`, // list of receivers
       subject: "Email Para Recuperar Contraseña", // Subject line
        text: "Email Para Recuperar Contraseña", // plain text body
        html: `<b>Ingresa a este link => ${link}</b>`, // html body
      }
      const rta = await this.sendMail(mail);
      return rta
    };

    async sendMail(infoMail) {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: config.email, // generated ethereal user
                pass: config.emailPassword, // generated ethereal password
            },
        });
        await transporter.sendMail(infoMail);
        return { message : 'Mail sent' }
    };

  async chagePassword (token, newPassword ){

    try {
      const payload = jwt.verify( token, config.jwtSecret );
      const user = await service.findOne( payload.sub );
      if(token !== user.recoveryToken){
        throw boom.unauthorized();
      };

      const hash = await bcrypt.hash( newPassword, 10 );
      await service.update( user.id, {
        recoveryToken: null,
        password : hash
      });
      return { message : 'Password Changed'}

    } catch (error) {
      throw boom.unauthorized();
    }
  }
}


module.exports = AuthServices;
