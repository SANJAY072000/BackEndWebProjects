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
                new Profile(profileValues).save()
                                          .then(profile=>res.status(200).json(profile))
                                          .catch(err=>console.log('Connection error'));
            })
           .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/profile/addp
@desc - a route to add preferences in the profile of an intern
@access - PRIVATE
*/
router.post('/addp',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               const preferences={};
               if(!profile)
               return res.status(404).json({noprofile:'No profile found to add preferences'});
               if(req.body.title)
               preferences.title=req.body.title;
               preferences.pn=profile.preferences.length+1;
               profile.preferences.push(preferences);
               profile.save()
                      .then(profile=>res.status(200).json(profile))
                      .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - delete
@route - /api/profile/delp-:pid
@desc - a route to remove specific preference in the profile of an intern
@access - PRIVATE
*/
router.delete('/delp-:pid',passport.authenticate('jwt',{session:false}),(req,res)=>{
Profile.findOne({user:req.user._id})
       .then(profile=>{
           const i=profile.preferences.findIndex(a=>a._id.toString()==req.params.pid.toString());
           profile.preferences.splice(i,1);
           profile.save()
                  .then(profile=>res.status(200).json(profile))
                  .catch(err=>console.log('Connection error'));
       })
       .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/profile/addlp
@desc - a route to add locationpreferences in the profile of an intern
@access - PRIVATE
*/
router.post('/addlp',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               const lpreferences={};
               if(!profile)
               return res.status(404).json({noprofile:'No profile found to add locationpreferences'});
               if(req.body.location)
               lpreferences.location=req.body.location;
               lpreferences.pn=profile.locationpreferences.length+1;
               profile.locationpreferences.push(lpreferences);
               profile.save()
                      .then(profile=>res.status(200).json(profile))
                      .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - delete
@route - /api/profile/dellp-:lpid
@desc - a route to remove specific locationpreference in the profile of an intern
@access - PRIVATE
*/
router.delete('/dellp-:lpid',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               const i=profile.locationpreferences.findIndex(a=>a._id.toString()==req.params.lpid.toString());
               profile.locationpreferences.splice(i,1);
               profile.save()
                      .then(profile=>res.status(200).json(profile))
                      .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
    });



// exporting all the routes
module.exports=router;
