const express=require('express'),
router=express.Router(),
bcrypt=require('bcryptjs'),
passport=require('passport'),
mongoose=require('mongoose'),
jsonwt=require('jsonwebtoken'),
key=require('../../setup/myurl'),
nodemailer=require('nodemailer'),
Person=require('../../models/Person');


/*
@type - POST
@route - /api/auth/register
@desc - a route to register
@access - PUBLIC
*/
router.post('/register',(req,res)=>{
    let email=req.body.email;
Person.findOne({email})
      .then(person=>{
          if(person)
          return res.status(400).json({alreadyregistered:"Email is already registered"});
          const newPerson=new Person({
              name:req.body.name,
              email:req.body.email,
              password:req.body.password
          });
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newPerson.password, salt, function(err, hash) {
       if(err)throw err;
       newPerson.password=hash;
       newPerson.save()
                .then(person=>{
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'sanjaysinghbisht751@gmail.com',
                          pass: 'jay07san@'
                        }
                      });
                      
                      var mailOptions = {};
                      mailOptions.from='sanjaysinghbisht751@gmail.com';
                      mailOptions.to=person.email;
                      mailOptions.subject='Thanks for registering';
                      mailOptions.text=`Welcome to techgeeks ! Your credentials are : email - ${person.email} and password - ${req.body.password}`;

                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                    return res.status(400).json(person);
                })
                .catch(err=>console.log('Connection error'));
    });
});
      })
      .catch(err=>console.log("Connection error"));
});


/*
@type - POST
@route - /api/auth/login
@desc - a route to login
@access - PUBLIC
*/
router.post('/login',(req,res)=>{
  let email=req.body.email,password=req.body.password;
Person.findOne({email})
      .then(person=>{
        if(!person)
        return res.status(404).json({loginerror:'Not registered'});
        bcrypt.compare(password,person.password)
              .then(iscorrect=>{
                if(iscorrect){
                  const payload={
                    id:person._id,
                    name:person.name,
                    email:person.email
                  };
                  jsonwt.sign(payload,key.secret,{expiresIn:3600},(err,token)=>{
                    if(err)throw err;
                    res.json({success:true,
                    token:`Bearer ${token}`});
                  });
                }
                else
                return res.status(400).json({loginerror:'Password is incorrect'});               
              })
              .catch(err=>console.log('Connection error'));
      })
      .catch(err=>console.log("Connection error"));
});


/*
@type - GET
@route - /api/auth/profile
@desc - a route to registration details
@access - PRIVATE
*/
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{
  Person.findOne({_id:req.user._id})
        .then(person=>{
          res.json(person);
        })
        .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/auth/profile
@desc - a route to update registration details
@access - PRIVATE
*/
router.post('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{
  const registValues={};
  if(req.body.name)
  registValues.name=req.body.name;
  if(req.body.email)
  registValues.email=req.body.email;
  if(req.body.password)
  registValues.password=req.body.password;
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(registValues.password, salt, (err, hash)=>{
       if(err)throw err;
       registValues.password=hash;
       Person.findOneAndUpdate({_id:req.user._id},{$set:registValues},{new:true})
             .then(person=>{
               res.json(person);
             })
             .catch(err=>console.log('Connection error'));
      });
    });
});
module.exports=router;