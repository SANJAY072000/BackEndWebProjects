// import all the required packages
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    var opts = {};


// import the secret from setup folder
const key=require('../setup/myurl');


// import all the required schemas
const Person=require('../models/Person');


opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret;


// exporting the strategy
module.exports=passport=>{
    passport.use(new JwtStrategy(opts,(jwt_payload, done)=>{
       Person.findById(jwt_payload.id)
             .then(person=>{
                 if(person)
                 return done(null, person);
                 else
                 return done(null, false);
             })
             .catch(err=>console.log('Connection error')); 
    }));
}


















