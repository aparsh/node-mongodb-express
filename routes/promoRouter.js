const express = require('express');
const bodyparser = require('body-parser');
const Promotions = require('../models/promotions');
var url = require('url');
var authenticate = require('../authenticate');


const promoRouter = express.Router();
promoRouter.use(bodyparser.json());


promoRouter.route('/')
.get((req,res,next) => {;
    Promotions.find({})
    .then((promotions)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotions);
    },(err) => next(err) )
    .catch((err) => next(err));
})
.post(authenticate.veryUser, (req, res, next) => {
        if(authenticate.verifyAdmin(req.user)){
                Promotions.create(req.body)
                .then((promotion)=>{
                        console.log('Created Promotion ', promotion);
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(promotion);
                },(err) => next(err) )
                .catch((err) => next(err));
        }
        else{
                res.statusCode = 403;
                res.setHeader('Content-Type','Plain-Text');
                res.end('Only admins are allowed to do a delete operation!!');
        }
})
.put(authenticate.veryUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.veryUser, (req, res, next) => {
        if(authenticate.verifyAdmin(req.user)){
                Promotions.deleteMany({})
                .then((resp)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(resp);
                },(err) => next(err) )
                .catch((err) => next(err));
        }
        else{
                err = new Error('Only admins can do that!!');
                err.statusCode = 403;
                next(err);
        }

});


promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err) => next(err) )
    .catch((err) => next(err));
})
.post(authenticate.veryUser, (req, res, next) => {
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.veryUser, (req, res, next) => {
        if(authenticate.verifyAdmin(req.user)){
                Promotions.findByIdAndUpdate(req.params.promoId,{
                        $set:req.body
                },{ new:true })
                .then((promo)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(promo);
                },(err) => next(err) )
                .catch((err) => next(err));
        }
        else{
                err = new Error('Only admins can do that!!');
                err.statusCode = 403;
                next(err);
        }
})
.delete(authenticate.veryUser, (req, res, next) => {
        if(authenticate.verifyAdmin(req.user)){
                Promotions.findByIdAndDelete(req.params.promoId)
                .then((resp)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(resp);
                },(err) => next(err) )
                .catch((err) => next(err));
        }
        else{
                err = new Error('Only admins can do that!!');
                err.statusCode = 403;
                next(err);
        } 
});

module.exports = promoRouter;