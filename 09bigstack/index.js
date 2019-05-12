const express=require('express'),
mongoose=require("mongoose"),
bodyparser=require('body-parser'),
passport=require('passport'),
//bring all routes
 auth=require('./routes/api/auth'),
 profile=require('./routes/api/profile'),
 questions=require('./routes/api/questions'),
 app=express(),
//mongodb configuration
db=require('./setup/myurl').mongoURL;
//middleware for body-parser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
//attempt to connect to database
    mongoose
    .connect(db,{
    useNewUrlParser:true })
    .then(()=>console.log("Mongodb Connected successfully...."))
    .catch((err)=>console.log(err));
    //Passport middleware
    app.use(passport.initialize());
    //config. for JWT strategy
    require('./strategies/jsonwtStrategy')(passport);
let port=process.env.PORT || 3000;
//actual routes
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/questions',questions);




app.listen(port,()=>console.log(`Server is running at port : ${port}`));




