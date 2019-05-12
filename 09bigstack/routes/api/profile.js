const express=require('express'),router=express.Router(),
mongoose=require('mongoose'),passport=require('passport'),
// Load Person model
Person=require('../../models/Person'),
// Load Profile model
Profile=require('../../models/Profile');

/*
@type GET
@route /api/profile/
@desc route for personal user profile
@access PRIVATE
*/
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
Profile.findOne({user:req.user.id})
       .then(profile=>{
           if(!profile){
               return res.status(404).json({profilenotfound:'No Profile found'});
           }
           res.json(profile);
       })
       .catch(err=>console.log(err));
});

/*
@type POST
@route /api/profile/
@desc route for UPDATING/SAVING personal user profile
@access PRIVATE
*/
router.post('/',passport.authenticate('jwt',{session:false}),
(req,res)=>{
    const profileValues={};
    profileValues.user=req.user.id;
    if(req.body.username)profileValues.username=req.body.username;
    if(req.body.website)profileValues.website=req.body.website;
    if(req.body.country)profileValues.country=req.body.country;
    if(req.body.portfolio)profileValues.portfolio=req.body.portfolio;
    if(req.body.languages)profileValues.languages=req.body.languages.split(',');
if(req.body.youtube||req.body.facebook||req.body.instagram)
{
profileValues.social={};   
if(req.body.youtube)profileValues.social.youtube=req.body.youtube;
if(req.body.facebook)profileValues.social.facebook=req.body.facebook;
if(req.body.instagram)profileValues.social.instagram=req.body.instagram;
}
//Do database stuff
Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(profile){
                Profile.findOne({username:profileValues.username})
                        .then(profile=>{
                            if(profile)return res.status(400).json(
                                {usernamewhenupdating:"Username already exists"});
                            Profile.findOneAndUpdate({user:req.user.id},
                                {$set:profileValues},{new:true})
                            .then(profile=>{
                                res.json(profile);
                            })
                            .catch(err=>console.log(err));
                        })
                        .catch(err=>console.log(err));
                
            }
            else{
                Profile.findOne({username:profileValues.username})
                        .then(profile=>{
                            //Username already exists
                            if(profile){
                                res.status(400).json({username:"Username already exists"});
                            }
                            //save user
                            new Profile(profileValues).save()
                            .then(profile=>res.json(profile))
                            .catch(err=>console.log(err));
                        })
                        .catch(err=>console.log(err));
            }
        })
        .catch(err=>console.log(err));

});

/*
@type GET
@route /api/profile/:username
@desc route for getting user profile based on USERNAME
@access PUBLIC
*/
router.get('/:username/:id',(req,res)=>{
    Profile.findOne({_id:req.params.id})
            .populate('user',['name','email'])
            .then(profile=>{
                if(!profile)return res.status(404).json({usernotfound:"User not found"});
               res.json(profile);
            })
            .catch(err=>console.log(err));
});

/*
@type GET
@route /api/profile/:id
@desc route for getting user profile based on ID
@access PUBLIC
*/
// router.get('/:id',(req,res)=>{
//     Profile.findOne({_id:req.params.id})
//             .then(profile=>{
//                 if(!profile)res.status(404).json({idnotfound:'ID not found'});
//                 res.json(profile);
//             })
//             .catch(err=>console.log(err));
//         });

/*
@type GET
@route /api/profile/everyone
@desc route for getting user profile of EVERYONE
@access PUBLIC
*/
router.get('/everyone',(req,res)=>{
    Profile.find()
            .populate('user',['name','email'])
            .then(profile=>{
                if(!profile)return res.status(404).json({usernotfound:"No profile was found"});
               res.json(profile);
            })
            .catch(err=>console.log(err));
});

/*
@type DELETE
@route /api/profile/
@desc route for deleting user basd on ID
@access PRIVATE
*/
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(!profile)return res.status(404).json({deleteprofile:'Profile not found'});

            Profile.findOneAndRemove({user:req.user.id})
            .then(()=>{
                Person.findOneAndRemove({_id:req.user.id})
                        .then(()=>{
                            res.json({
                                success:"Deleted successfully"
                            });

                        })
                        .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));

            })
            .catch(err=>console.log(err));
});

/*
@type POST
@route /api/profile/workrole
@desc route for entering workrole of user
@access PRIVATE
*/
router.post('/workrole',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(!profile)return res.status(404)
                .json({profilenotfound:'Profile not found for workrole'});
                const workrole={
                    role:req.body.role,
                    company:req.body.company,
                    country:req.body.country,
                    current:req.body.current,
                    details:req.body.details
                };
                profile.workrole.push(workrole);
                profile.save()
                        .then(profile=>res.json(profile))
                        .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));
});

/*
@type DELETE
@route /api/profile/workrole/:W_ID
@desc route for DELETING workrole of user
@access PRIVATE
*/
router.delete('/workrole/:w_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(!profile)return res.status(404).json({deleteworkrole:'Profile not found'});
                const removethis=profile.workrole.findIndex((a,b)=>(a._id==req.params.w_id));
                profile.workrole.splice(removethis,1);
                profile.save()
                        .then(profile=>res.json(profile))
                        .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));
});

module.exports=router;
