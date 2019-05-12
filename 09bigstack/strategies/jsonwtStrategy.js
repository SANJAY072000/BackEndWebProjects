const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt,
mongoose=require('mongoose'),
Person=mongoose.model("myperson"),
myKey=require('../setup/myurl'),opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;
module.exports=passport=>{passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
Person.findById(jwt_payload.id)
    .then(person=>{
        if(person){return done(null,person);}
        return done(null,false);
    })
    .catch(err=>console.log(err));
}));}


