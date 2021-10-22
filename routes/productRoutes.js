const Router = require('express').Router({strict:true});
const { requireSignIn, isAdmin, isAuth } = require('../controllers/authController');
const { UserById } = require('../controllers/userController');
const { create, ProductById, read, remove, update, list, relatedProducts, listCategories, listBySearch, photo, listSearch} = require('../controllers/productController');

Router.get('/product/:ProductId', read);

Router.get('/products', list);

Router.get('/products/related/:ProductId', relatedProducts);

Router.get('/products/categories', listCategories);

Router.post('/products/by/search', listBySearch);
Router.get('/products/search', listSearch);

Router.get('/product/photo/:ProductId', photo)

Router.post('/product/create/:UserId', requireSignIn, isAuth, isAdmin, create);

Router.delete('/product/:ProductId/:UserId', requireSignIn, isAuth, isAdmin, remove);

Router.put('/product/:ProductId/:UserId', requireSignIn, isAuth, isAdmin, update);

Router.param('ProductId', ProductById);

Router.param('UserId', UserById);

module.exports = Router;