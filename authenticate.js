var pssport = require('passport');
var LocalStratergy = require('passport-local').Strategy;
var User = require('./models/user');
const passport = require('passport');
var JwtStratergy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FcaebookTokenStratergy = require('passport-facebook-token');

var config = require('./config');
const { NotExtended } = require('http-errors');
const user = require('./models/user');
const e = require('express');



exports.local = passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,
        {expiresIn:3600});
}

var opts={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStratergy(opts,
    (jwt_paylod,done)=>{
        console.log('JWT Payload: '+jwt_paylod);
        User.findOne({_id:jwt_paylod._id}, (err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }));

exports.veryUser = passport.authenticate('jwt',{session:false});

exports.verifyAdmin = (user) =>{
    if(user.admin){
        return true;
    }
    else{
        return false;
    }
};

exports.verifyAdminInLine = (req, res, next) => {
    if(req.user.admin)
    {
        next();
    }
    else
    {
        err = new Error('Only admins can do that!!');
        err.statusCode = 403;
        next(err);
    }
}

exports.FacebookPassport = passport.use(
    new FcaebookTokenStratergy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
    }, (accessToken,refreshToken,profile,done)=>{
    
    user.findOne({FacebookId: profile.id}, (err,user)=>{
        if(err){
            return done(err,false);
        }
        if(!err && user!==null){
            return done(null,user);
        }
        else{
            var user = new User({username: profile.displayName});
            user.FacebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;

            user.save((err,user)=>{
                if(err)
                    return done(err,false);
                else
                    return done(false,user);
            });
        }
    });
}));

