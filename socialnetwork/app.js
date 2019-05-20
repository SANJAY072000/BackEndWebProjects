const express=require('express'),app=express(),port=process.env.PORT || 3000;
const mongoose=require('mongoose'),dbstr=require('./setup/myurl').mongourl;


//connect to mongodb
mongoose.connect(dbstr,{useNewUrlParser:true})
        .then(()=>console.log('Mongodb connected successfully'))
        .catch(err=>console.log('Connection error'));


const passport=require('passport'),
bodyparser=require('body-parser');


//fetching all the routes from files
const auth=require('./routes/api/auth'),
profile=require('./routes/api/profile'),
message=require('./routes/api/message'),
post=require('./routes/api/post'),
group=require('./routes/api/group');


//configuring middleware for body-parser
app.use(bodyparser.urlencoded({extended:true}));


//configuring body-parser for json data
app.use(bodyparser.json());


//configuring middleware for passport
app.use(passport.initialize());


//fetching the jsonwtStrategy.js
require('./strategies/jsonwtStrategy')(passport);


//configuring routes 
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/message',message),
app.use('/api/post',post);
app.use('/api/group',group);


app.listen(port,()=>console.log(`Server is running at port ${port}`));

