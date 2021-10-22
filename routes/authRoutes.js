const Router = require('express').Router({strict:true});
const {SignUp, SignIn, SignOut,requireSignIn } = require('../controllers/authController');
const {userSignUpValidator} = require('../validators/SignupValidator');

Router.post('/signup',userSignUpValidator,SignUp); //Signup with validation middleware

Router.post('/signin', SignIn); //Signin with Authenication middleware

Router.get('/signout', SignOut);

Router.get('/hello', requireSignIn, (req, res)=> res.send('Hello World'));

module.exports = Router;