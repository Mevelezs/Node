const express = require('express');
const passport = require('passport');

const OrderServices = require ('../services/orderServices');

const router = express.Router();
const service = new OrderServices()

router.get('/my-orders',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            const order = await service.OrderByUser(user.sub);
            res.json(order);

        } catch (error) {

            next(error);

        }
    }
);


module.exports = router;
