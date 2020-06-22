const express = require('express');
const bodyparser = require('body-parser');
var url = require('url');

const leaderRouter = express.Router();
leaderRouter.use(bodyparser.json());

leaderRouter.route('/:leaderId')
.all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
})
.get((req,res,next) => {
    var reqid = req.url.substr(1);
    //console.log('dishId : ' + req.url.substr(1));
    res.end('Will send the leader name with Id : '+reqid+' to you!!!');
})
.post((req, res, next) => {
    var reqid = req.url.substr(1);
    res.end('POST operation not supported on /leadership/'+ reqid);
})
.put((req, res, next) => {
    var reqid = req.url.substr(1);
    res.write('Updating the leader: ' + reqid + '\n');
    res.end('Will update the leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    var reqid = req.url.substr(1);
    res.end('Deleting leader: ' + reqid);
});

leaderRouter.route('/')
.all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
})
.get((req,res,next) => {;
    res.end('Will send all the leader names to you!');
})
.post((req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leadership');
})
.delete((req, res, next) => {
        res.end('Deleting all leaders list');
});

module.exports = leaderRouter;