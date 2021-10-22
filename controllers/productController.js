const Product = require('../models/product');
const {errorHandler} = require('../helpers/DBErrorHandlers');
const _ = require('lodash');
const fs = require('fs');
const formidable = require('formidable');

exports.ProductById = function (req, res, next, id){
    Product.findById(id).populate('category').exec((error, product) => {
        if (error || !product){
            res.status(400).json({
                error : "Product not Found"
            });
        }
        req.product = product
        next();
    });
}

exports.read = function (req, res){
    req.product.photo = undefined
    return res.json(req.product);
}

exports.create = function (req, res){
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (error, fields, files) => {
        if (error){
            return res.status(400).json({
                error : "Image could not be uploaded"
            });
        }
        //Check for fields
        const {name, price, category, shipping, quantity, description, sold} = fields;
        const {photo} = files
        if (!name || !price || !category || !shipping || !quantity || !description || !photo){
            return res.status(400).json({
                error: 'All fields are required'
            });

        }
        let product = new Product(fields);
        product = _.extend(product, fields);
        if (files.photo){
            if(files.photo.size > 10000000){
                return res.status(400).json({
                    error : "Image size should be less than 10MB"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type
        }
        product.save((error, result) => {
            if (error){
                return res.status(400).json({
                    error : errorHandler(error)
                });
            }
            else{
                return res.json(result);
            }
        });
    });
}

exports.remove = function (req, res){
    let product = req.product
    product.remove(function (error, deletedProduct){
        if (error){
            res.status(400).json({
                error : errorHandler(error)
            });
        }
        res.json({
            deletedProduct,
            message : "Product Deleted Successfully"
        });
    });
}

exports.update = function (req, res){
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (error, fields, files) => {
        if (error){
            res.status(400).json({
                error : "Image could not be uploaded"
            });
        }
        //Check for fields
        const {name, price, category, shipping, quantity, description, sold} = fields;
        const {photo} = files
        if (!name || !price || !category || !shipping || !quantity || !description || !photo){
            res.status(400).json({
                message: 'All fields are required'
            });

        }
        let product = req.product;
        product = _.extend(product, fields);
        if (files.photo){
            if(files.photo.size > 10000000){
                return res.status(400).json({
                    error : "Image size should be less than 10MB"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type
        }
        product.save((error, result) => {
            if (error){
                return res.status(400).json({
                    error : errorHandler(error)
                });
            }
            else{
                return res.json({result});
            }
        });
    });
};

/**
 * Querying  by sell and arrival
 * query by sell : from Client : can be : /products?sortBy=sold&order=desc&limit=4
 * query by arival : from client : can be : /products?sortBy=createdAt&order=desc&limit=4 
 */

exports.list = function (req, res){
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    
    Product.find().select('-photo').populate('category').sort([[sortBy, order]]).limit(limit)
    .exec(function (err, products){
        if (err){
            return res.status(400).json({
                error : 'Products not found'
            })
        }
        res.json({products});
    });
}

/**
 * find the related products based on req product category
 * the returned products will be of the same category as the requested product, excluding it( the product in  req ).
 * 
 */

exports.relatedProducts = function (req, res){
    let limit = req.query.limit ? parseInt(req.query.limit) : 6 ;
    
    Product.find({_id: {$ne : req.product}, category : req.product.category}).limit(limit)
    .populate('category',  '_id name')
    .exec(function (error, relatedProducts){
        if (error) {
            return res.status(400).json({
                error : 'This product has no related products',   
            });
        }
        res.json({relatedProducts});
    });
}

exports.listCategories = function (req, res) {
    Product.distinct('category', {}, function (error, categories){
        if (error) {
            return res.status(400).json({
                error : 'Categories not found',     
            });
        }
        res.json({categories})
    });
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = function (req, res) {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = function (req, res, next) {
    if (req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
}

exports.listSearch = function (req, res){
    const query = {}

    if (req.query.search){
        query.name = {$regex:req.query.search, $options : 'i'}
        
        if (req.query.category && req.query.category != 'All'){
            query.category = req.query.category
        }
    }
    
    Product.find(query, function(error, products){
        if (error){
            return res.status(400).json({
                error : errorHandler(error)
            })
        }
        else {
            return res.json(products);
        }
    }).select('-photo');
}
