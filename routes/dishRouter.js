const express = require('express');
const bodyparser = require('body-parser');
var url = require('url');

const dishRouter = express.Router();
dishRouter.use(bodyparser.json());

dishRouter.route('/:dishId')
.all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
})
.get((req,res,next) => {
    var reqid = req.url.substr(1);
    //console.log('dishId : ' + req.url.substr(1));
    res.end('Will send the dish with Id : '+reqid+' to you!!!');
})
.post((req, res, next) => {
    var reqid = req.url.substr(1);
    res.end('POST operation not supported on /dishes/'+ reqid);
})
.put((req, res, next) => {
    var reqid = req.url.substr(1);
    res.write('Updating the dish: ' + reqid + '\n');
    res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    var reqid = req.url.substr(1);
    res.end('Deleting dish: ' + reqid);
});

dishRouter.route('/')
.all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
})
.get((req,res,next) => {;
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
        res.end('Deleting all dishes');
});

module.exports = dishRouter;