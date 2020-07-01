const express = require('express');
const bodyparser = require('body-parser');
const Leaders = require('../models/leaders');
var url = require('url');
const authenticate = require('../authenticate');

const leaderRouter = express.Router();
leaderRouter.use(bodyparser.json());


leaderRouter.route('/')
.get((req,res,next) => {;
        Leaders.find({})
        .then((leaders)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(leaders);
        },(err) => next(err) )
        .catch((err) => next(err));
    })
    .post(authenticate.veryUser, (req, res, next) => {
        if(authenticate.verifyAdmin(req.user)){
                Leaders.create(req.body)
                .then((leader)=>{
                        console.log('Created Leader ', leader);
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(leader);
                },(err) => next(err) )
                .catch((err) => next(err));
        }
        else{
                err = new Error('Only admins can do that!!');
                err.statusCode = 403;
                next(err);
        } 
            
    })
    .put(authenticate.veryUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /leaders');
    })
    .delete(authenticate.veryUser, (req, res, next) => {
        if(authenticate.verifyAdmin(req.user)){
        Leaders.deleteMany({})
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
    
    
leaderRouter.route('/:leaderId')
.get((req,res,next) => {
        Leaders.findById(req.params.leaderId)
        .then((leader)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err) => next(err) )
        .catch((err) => next(err));
})
.post(authenticate.veryUser, (req, res, next) => {
        res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(authenticate.veryUser, (req, res, next) => {
        if(authenticate.verifyAdmin(req.user)){
                Leaders.findByIdAndUpdate(req.params.leaderId,{
                        $set:req.body
                },{ new:true })
                .then((leader)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(leader);
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
        Leaders.findByIdAndDelete(req.params.leaderId)
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
      
module.exports = leaderRouter;