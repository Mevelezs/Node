const express = require('express');
const passport = require('passport');

const AuthServices = require ('./../services/authservices');

const router = express.Router();

const service = new AuthServices()

router.post('/login',
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            res.json(await service.singToken(user))

        } catch (error) {

            next(error);

        }
    }
);

router.post('/recovery', async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await service.sendRecovery(email)
      res.json(rta)

    } catch (error) {

       next(error);
    }
});

router.post('/change-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const rta = await service.chagePassword( token, newPassword )
    res.json(rta)

  } catch (error) {

    next(error);
  }
})


module.exports = router;
