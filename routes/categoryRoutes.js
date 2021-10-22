const Router = require('express').Router({strict:true});
const { requireSignIn, isAdmin, isAuth } = require('../controllers/authController');
const { UserById } = require('../controllers/userController');
const { create, CategoryById, remove, update, read, list } = require('../controllers/categoryController');

Router.get('/category/:CategoryId', read);

Router.get('/categories', list);

Router.post('/category/create/:UserId', requireSignIn, isAuth, isAdmin, create);

Router.delete('/category/:CategoryId/:UserId', requireSignIn, isAuth, isAdmin, remove);

Router.put('/category/:CategoryId/:UserId', requireSignIn, isAuth, isAdmin, update);

Router.param('UserId', UserById);

Router.param('CategoryId', CategoryById);

module.exports = Router;