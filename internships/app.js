// import all the required packages
const express=require('express'),
mongoose=require('mongoose'),
passport=require('passport'),
bodyparser=require('body-parser');


// create the server
const app=express();


// port number
const port=process.env.PORT || 3000;


// fetching the mongourl from setup folder
const dbstr=require("./setup/myurl").mongourl;


//fetching all the routes from the routes/api folder
const auth=require("./routes/api/auth"),
profile=require("./routes/api/profile"),
resume=require("./routes/api/resume"),
internshipprofile=require('./routes/api/internshipprofile');


// configuring middlewares for bodyparser 
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


// configuring middleware for passport
app.use(passport.initialize());


// fetching the jwt strategy from strategies folder
require('./strategies/jsonwtStrategy')(passport);


// configuring all the routes
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/resume',resume);
app.use('/api/internshipprofile',internshipprofile);


// connecting to mongodb database
mongoose.connect(dbstr,{useNewUrlParser:true})
        .then(()=>console.log('Mongodb connected successfully'))
        .catch(err=>console.log('Connection error'));














// starting the server
app.listen(port,()=>console.log(`Server is running at port ${port}`));


















