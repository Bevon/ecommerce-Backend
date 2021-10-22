const Router = require('express').Router({strict:true});
const {requireSignIn, isAuth} = require('../controllers/authController');
const { generateToken, processPayment } = require('../controllers/braintreeController');
const { UserById } = require('../controllers/userController');

Router.get('/braintree/getToken/:userId', requireSignIn, isAuth, generateToken);
Router.post('/braintree/payment/:userId', requireSignIn, isAuth, processPayment);

Router.param('userId', UserById);

module.exports = Router;