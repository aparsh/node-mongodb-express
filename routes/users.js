var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next) => {
  User.findOne({username : req.body.username})
  .then((user)=>{
    if(user != null)
    {
      var err = new Error('user '+req.body.username+' already exist!');
      err.status = 403;
      next(err);
    }
    else{
      return User.create({
        username : req.body.username,
        password : req.body.password
      })
    }
  })
  .then((user)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status: 'Resgistration Successful!', user : user});
  },(err) => next(err))
  .catch((err) => next(err));
});


router.post('/login', (req,res,next)=>{
  if(!req.session.user)
  {
    var authHeader = req.headers.authorization;

    if(!authHeader)
    {
      console.log('error1');
      var err = new Error('You are not Authenticated!');
      res.setHeader('WWW-Authenticate','Basic');
      err.status=401
      next(err); 
      return;   
    }

    var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    console.log(username + ':' + password);

    User.findOne({username:username})
    .then((user) => {
      if(user == null)
      {
        var err = new Error('User'+username+'does not exist!!');
        err.status=403;
        return next(err);
      }
      else if(user.password != password)
      {
        var err = new Error('Incorrect password!!');
        err.status=403;
        return next(err);
      }
      else if(user.username === username && user.password === password)
      {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })  
    .catch((err)=>next(err)); 
  }
  else
  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!')
  }
});

router.get('/logout', (req,res,next) => {
  if(req.session)
  {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else 
  {
    var err = new Error('Youa re not logged in!!');
    err.status=403;
    return next(err);
  }
});

module.exports = router;
