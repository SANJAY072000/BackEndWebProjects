const express=require('express'),
router=express.Router(),
passport=require('passport'),
Person=require('../../models/Person'),
Profile=require('../../models/Profile');


/*
@type - GET
@route - /api/profile
@desc - a route to display profile
@access - PRIVATE
*/
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({"user":req.user._id})
           .then(profile=>{
               if(!profile)
               return res.status(404).json({profileerror:'Profile not found'});
               res.json(profile);
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/profile
@desc - a route to create profile
@access - PRIVATE
*/
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const profileValues={};
    profileValues.user=req.user._id;
    profileValues.personal={};
    if(req.body.username)
    profileValues.personal.username=req.body.username;
    if(req.body.age)
    profileValues.personal.age=req.body.age;
    if(req.body.phone)
    profileValues.personal.phone=req.body.phone;
    if(req.body.profilepic)
    profileValues.personal.profilepic=req.body.profilepic;
    if(req.body.gender)
    profileValues.personal.gender=req.body.gender;
    profileValues.residence={};
    if(req.body.address)
    profileValues.residence.address=req.body.address;
    if(req.body.city)
    profileValues.residence.city=req.body.city;
    if(req.body.state)
    profileValues.residence.state=req.body.state;
    if(req.body.country)
    profileValues.residence.country=req.body.country;
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               if(profile){
                   Profile.findOneAndUpdate({user:req.user._id},{$set:profileValues},{new:true})
                   .then(profile=>res.json(profile))
                   .catch(err=>console.log('Connection error'));
                         } 
          else{
            Profile.findOne({username:profileValues.personal.username})
            .then(profile=>{
                if(profile)
                return res.status(400).json({usernameerror:'Username already exists'});
                new Profile(profileValues).save()
                .then(profile=>res.json(profile))
                .catch(err=>console.log('Connection error'));
            })
            .catch(err=>console.log('Connection error')); 
          }
          

          
        })
        .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/profile/social
@desc - a route to add social links in profile
@access - PRIVATE
*/
router.post('/social',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const social={};
    if(req.body.socialmedia)
    social.socialmedia=req.body.socialmedia;
    if(req.body.url)
    social.url=req.body.url;
    if(req.body.active)
    social.active=req.body.active;
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               if(profile){
               profile.social.unshift(social);
               profile.save()
                      .then(profile=>res.json(profile))
                      .catch(err=>console.log('Connection error'))
                    }
                    else res.status(404).json({profileerror:"Profile not found"});
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - DELETE
@route - /api/profile/social/:socialid
@desc - a route to delete social links in profile
@access - PRIVATE
*/
router.delete('/social/:socialid',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
            if(profile){
                if(profile.social.length>0){
                    const i=profile.social.findIndex(a=>a._id==req.params.socialid);
                    profile.social.splice(i,1);
                    profile.save()
                           .then(profile=>res.json(profile))
                           .catch(err=>console.log('Connection error'));
                }
               else res.status(404).json({socialerror:'Social links not found'});
            }
            else res.status(404).json({profileerror:'Profile not found'});
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - GET
@route - /api/profile/-:username
@desc - a route to find profile based on username
@access - PUBLIC
*/
router.get('/-:username',(req,res)=>{
    Profile.findOne({'personal.username':req.params.username})
           .populate('user',['name','email'])
           .then(profile=>{
               if(profile)
                return res.status(400).json(profile);
                res.status(404).json({profileerror:'Profile not found'});
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - GET
@route - /api/profile/all
@desc - a route to display all profiles
@access - PUBLIC
*/
router.get('/all',(req,res)=>{
    Profile.find()
        .populate('user',['name','email'])   
        .then(profile=>res.json(profile))
        .catch(err=>console.log('Connection error'))
});


/*
@type - DELETE
@route - /api/profile/remove
@desc - a route to delete a user
@access - PRIVATE
*/
router.delete('/remove',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               if(profile){
                Profile.findOneAndRemove({user:req.user._id})
           .then(()=>{
               Person.findOneAndRemove({_id:req.user._id})
                     .then(()=>{
                         return res.status(200).json({deletesuccess:'Successfully deleted'});
                     })
                     .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
               }
               else{
                Person.findOneAndRemove({_id:req.user._id})
                .then(()=>{
                    return res.status(200).json({deletesuccess:'Successfully deleted'});
                })
                .catch(err=>console.log('Connection error'));
               }
           })
           .catch(err=>console.log('Connection error'));
});


module.exports=router;


