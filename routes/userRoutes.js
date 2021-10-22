const Router = require('express').Router({strict:true});
const { requireSignIn, isAdmin, isAuth } = require('../controllers/authController');
const { UserById, read, update } = require('../controllers/userController');

Router.get('/secret/:UserId', requireSignIn, isAuth, (req, res) => {
    res.json({
        user : req.profile
    });
});

Router.get('/user/:UserId', requireSignIn, isAuth, read);

Router.put('/user/:UserId', requireSignIn, isAuth, update);

Router.param('UserId', UserById);


module.exports = Router;