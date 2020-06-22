const express = require('express');
const bodyparser = require('body-parser');
var url = require('url');

const promoRouter = express.Router();
promoRouter.use(bodyparser.json());

promoRouter.route('/:promoId')
.all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
})
.get((req,res,next) => {
    var reqid = req.url.substr(1);
    //console.log('dishId : ' + req.url.substr(1));
    res.end('Will send the promos with Id : '+reqid+' to you!!!');
})
.post((req, res, next) => {
    var reqid = req.url.substr(1);
    res.end('POST operation not supported on /promotions/'+ reqid);
})
.put((req, res, next) => {
    var reqid = req.url.substr(1);
    res.write('Updating the promocoupon: ' + reqid + '\n');
    res.end('Will update the promocoupon with name: ' + req.body.name + 
        ' and with details: ' + req.body.description);
})
.delete((req, res, next) => {
    var reqid = req.url.substr(1);
    res.end('Deleting promocoupon: ' + reqid);
});

promoRouter.route('/')
.all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
})
.get((req,res,next) => {;
    res.end('Will send all the promos to you!');
})
.post((req, res, next) => {
        res.end('Will add the promocoupon: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
        res.end('Deleting all promotions');
});

module.exports = promoRouter;