const User = require('../models/user');
const {errorHandler} = require('../helpers/DBErrorHandlers');
const jwt  = require('jsonwebtoken'); //generate signed token
const expressJwt = require('express-jwt');
const dotenv = require('dotenv');

dotenv.config()

exports.SignUp = function (req, res){
    const user = new User(req.body);
    user.save((err, user) =>{
        if (err){
            return res.status(400).json({err:errorHandler(err)});
        }
        else{
            user.hashed_password = undefined
            user.salt = undefined
            res.json({user})
        }
    });
}

exports.SignIn = function (req, res){
    //Find User by email
    const {email, password} = req.body;
    User.findOne({email}, (error, user) =>{
        if (error || !user){ //incase of an error/user not found
            return res.status(400).json({
                error:'User with that email does not exist. Sign Up'
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:'Email & Password does not match'
            });
        }
        // User found, make sure the email and password match
        // Hash the password here to check against the already hashed password.
        // Youll add an authenicate method to the User Model Methods
        // Generate a signed token using the user id and secret
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET);
        //persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
        //return response with user and token to frontend
        const {_id, name, email, role} = user;
        return res.json({token, user:{_id, name, email, role}});
    });
}

exports.SignOut = function (req, res){
    res.clearCookie('t', );
    return res.json({message: 'Signout Success!'});
}

exports.requireSignIn =  expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:'auth', 
    algorithms:['HS256']
});

exports.isAuth = function (req, res, next){
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({
            error: 'Access Denied'
        });
    }
    next();
}

exports.isAdmin = function (req, res, next){
    if (req.profile.role === 0){
        return res.status(403).json({
            error: 'Admin Resource. Access Denied'

        });
    }
    next();
}
