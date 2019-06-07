// import all the required packages
const express=require('express'),
router=express.Router(),
bcrypt=require('bcryptjs'),
nodemailer=require('nodemailer'),
jsonwt=require('jsonwebtoken'),
passport=require('passport');


// import all the required schemas
const Person=require('../../models/Person');


// import the secret from setup folder
const key=require('../../setup/myurl');


/*
@type - GET
@route - /api/auth/test
@desc - a route to test the project settings
@access - PUBLIC
*/
router.get('/test',(req,res)=>res.json({test:"Successful project Settings"}));


/*
@type - POST
@route - /api/auth/register
@desc - a route to register the user
@access - PUBLIC
*/
router.post('/register',(req,res)=>{
    Person.findOne({email:req.body.email})
          .then(person=>{
              if(person)return res.status(400).json({emailalreadyregistered:'You are already registered'});
              let name=req.body.name,
                  email=req.body.email,
                  password=req.body.password;
              const newPerson=new Person({
                  name,email,password
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
                              mailOptions.text=`Welcome to Internshala ! Your credentials are : email - ${person.email} and password - ${req.body.password}`;
        
                              
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
          .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/auth/login
@desc - a route to login the user
@access - PUBLIC
*/
router.post('/login',(req,res)=>{
    let email=req.body.email,
        password=req.body.password;
Person.findOne({email})
      .then(person=>{
          if(!person)
          return res.status(404).json({notregistered:'You are not registered'});
          bcrypt.compare(password,person.password)
                .then(iscorrect=>{
                    if(iscorrect)
                    {
                      const payload={
                          id:person._id,
                          email:person.email,
                          password:person.password,
                          name:person.name,
                      };
                      jsonwt.sign(payload,key.secret,{expiresIn:3600},(err,token)=>{
                          if(err)throw err;
                          res.status(200).json({success:true,
                        token:`Bearer ${token}`});
                      });
                    }
                    else 
                    res.status(400).json({loginerror:'Password is incorrect'})
                })
                .catch(err=>console.log('Connection error'));
      })
      .catch(err=>console.log('Connection error'));

});


/*
@type - GET
@route - /api/auth/login
@desc - a route to test the login of the user
@access - PRIVATE
*/
router.get('/login',passport.authenticate('jwt',{session:false}),
(req,res)=>res.status(200).json({loginsuccess:`${req.user.name} is logged in successfully`}));




// exporting all the routes
module.exports=router;
























