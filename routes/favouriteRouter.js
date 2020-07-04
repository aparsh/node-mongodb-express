const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const FavouriteDishes = require('../models/favourites');
var url = require('url');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favouriteRouter = express.Router();
favouriteRouter.use(bodyparser.json());


favouriteRouter.route('/')
.get(cors.cors, authenticate.veryUser, (req,res,next)=>{
    FavouriteDishes.find({user:req.user._id})
    .populate('user')
    .populate('dishes.dish')
    .then((favouritedishes)=>{
        console.log(favouritedishes);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favouritedishes);
    },(err) => next(err) )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.veryUser,(req,res,next)=>{
    FavouriteDishes.findOne({user:req.user._id})
    .then((favouritedishes)=>{
        if(favouritedishes==null){
            FavouriteDishes.create({user:req.user._id})
            .then((favouritedish)=>{
                favouritedish.dishes=[];
                for(var i = 0; i < req.body.length; i++)
                {
                    favouritedish.dishes.push({dish: req.body[i]._id});
                }
                favouritedish.save()
                .then((favouriteDishes)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json');
                    res.json(favouriteDishes);
                },(err) => next(err))
                .catch((err) => next(err));
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else{
            for(var i = 0; i < req.body.length; i++)
            {
                var index = -1;
                for(var j = 0; j<favouritedishes.dishes.length;j++)
                {
                    if(favouritedishes.dishes[j].dish = req.body[i]._id)
                    {
                        index=j;
                        break;
                    }
                }
                if(index==-1)
                {
                    favouritedishes.dishes.push({dish: req.body[i]._id});
                }
            }
            favouritedishes.save()
            .then((favouriteDishes)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json');
                res.json(favouriteDishes);
            },(err) => next(err))
            .catch((err) => next(err));
        }
    },(err) => next(err) )
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.veryUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite');  
})
.delete(cors.corsWithOptions, authenticate.veryUser, (req,res,next)=>{
    FavouriteDishes.findOneAndRemove({user:req.user._id})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err) )
    .catch((err) => next(err));    
});


favouriteRouter.route('/:dishId')
.get(cors.cors, authenticate.veryUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /favourite/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.veryUser,(req,res,next)=>{
    FavouriteDishes.findOne({user:req.user._id})
    .then((favouritedishes)=>{
        console.log(favouritedishes);

        if(favouritedishes===null){
            FavouriteDishes.create({user:req.user._id})
            .then((favouritedish)=>{
                //console.log(favouritedish);
                favouritedish.dishes.push({dish: req.params.dishId});
                favouritedish.save()
                .then((favouriteDishes)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json');
                    res.json(favouriteDishes);
                },(err) => next(err))
                .catch((err) => next(err));
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else{
            var index=-1;
            for(var i=0;i<favouritedishes.dishes.length;i++)
            {
                if(favouritedishes.dishes[i].dish = req.params.dishId)
                {
                    index=i;
                    break;
                }
            }
            if(index=-1)
            {
                favouritedishes.dishes.push({dish: req.params.dishId});
            }
            favouritedishes.save()
            .then((favouriteDishes)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json');
                res.json(favouriteDishes);
            },(err) => next(err))
            .catch((err) => next(err));
        }
    },(err) => next(err) )
    .catch((err) => next(err)); 
    
})
.put(cors.corsWithOptions, authenticate.veryUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite/' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.veryUser, (req,res,next)=>{
    FavouriteDishes.findOne({user : req.user._id})
    .then((favouritedishes)=>{
        if(favouritedishes!=null && favouritedishes.dishes !=null )
        {
            var index = -1;
            for(var i=0;i<favouritedishes.dishes.length;i++)
            {
                if(favouritedishes.dishes[i].dish==req.params.dishId)
                {
                    index = i;
                    break;
                }
            }
            console.log(index);
            if(index>=0)
            {
                favouritedishes.dishes.splice(index,1);
                favouritedishes.save()
                .then((favouriteDishes)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json');
                    res.json(favouriteDishes);
                },(err) => next(err))
                .catch((err) => next(err));
            }
            else{
                err = new Error('Not in your list');
                err.statusCode = 404;
                next(err); 
            }
            
        }
        else if(favouritedishes==null)
        {
            err = new Error('You dont have a favourite list');
            err.statusCode = 404;
            next(err); 
        }
        else
        {
            err = new Error('Your favourite list is empty ');
            err.statusCode = 404;
            next(err); 
        }
    },(err) => next(err) )
    .catch((err) => next(err));   
});


module.exports = favouriteRouter;
