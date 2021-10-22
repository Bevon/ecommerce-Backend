const User = require('../models/user');
const braintree = require('braintree');
const dotenv = require('dotenv');

dotenv.config();

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    merchantId: process.env.BRAINTREE_MERCHANT_ID
})

exports.generateToken = function(req, res){
    //connect to braintree and generate clientToken
    gateway.clientToken.generate({}, function(err, response){
        if (err){
            res.send(err);
        }
        else{
            res.send(response);
        }
    })

}

exports.processPayment = function(req, res){
    //process payment to braintree from client nonce

    let nonceFromClient = req.body.paymentMethodNonce;
    let amount = req.body.amount;
    let aTranscraction = gateway.transaction.sale({
        amount:amount,
        paymentMethodNonce:nonceFromClient,
        options: {
            submitForSettlement:true
        }
    }, function (err, response){
        if (err){
            return res.status(500).json(err);
        }
        else{
            return res.json(response);
        }

    });
}
    
