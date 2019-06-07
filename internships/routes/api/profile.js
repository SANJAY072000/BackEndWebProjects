// import all the required packages
const express=require('express'),
router=express.Router(),
nodemailer=require('nodemailer'),
passport=require('passport');


// import all the required schemas
const Profile=require('../../models/Profile'),
Person=require('../../models/Person'),
InternshipProfile=require('../../models/InternshipProfile'),
Internship=require('../../models/Internship');


/*
@type - GET
@route - /api/profile/all
@desc - a route to display the profile of all interns
@access - PUBLIC
*/
router.get('/all',(req,res)=>{
    Profile.find()
           .populate('user',['name','email'])
           .then(profile=>{
               if(profile.length)
               return res.status(200).json(profile);
               res.status(404).json({noprofiletodisplay:'No profile of any intern being found'});
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/profile/create
@desc - a route to create the profile of an intern
@access - PRIVATE
*/
router.post('/create',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               if(profile)
               return res.status(400).json({profilealreadyexists:'Profile already exists'});
               const profileValues={};
               profileValues.user=req.user._id;
               if(req.body.availability)
                profileValues.availability=req.body.availability;
                
            })
           .catch(err=>console.log('Connection error'));
});












// exporting all the routes
module.exports=router;
