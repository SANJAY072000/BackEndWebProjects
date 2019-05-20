const express=require('express'),
router=express.Router(),
Person=require('../../models/Person'),
Profile=require('../../models/Profile'),
Group=require('../../models/Group'),
passport=require('passport');


/*
@type - GET
@route - /api/group/all
@desc - a route to display all groups
@access - PUBLIC
*/
router.get('/all',(req,res)=>{
    Group.find()
         .then(group=>{
             if(group.length>0)
             return res.status(400).json(group);
             res.status(404).json({grouperror:'No groups formed yet'});
         })
         .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/group/create
@desc - a route to create a group
@access - PRIVATE
*/
router.post('/create',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const groupValues={};
    let mp;
    if(req.body.name)
    groupValues.name=req.body.name;
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               groupValues.admins.push({
                   user:req.user._id,
                   username:profile.personal.username
               });
               groupValues.members.push({
                   user:req.user._id,
                   username:profile.personal.username,
                   isAdmin:true
               });
               //comma separated values of username as members of a group
               const members=req.body.members.split(',');
               members.forEach(m=>{
                   Profile.findOne({'personal.username':m})
                          .then(prf=>{
                              if(!prf)
                              {
                                   mp=new Map();
                                  mp.set(m,"Profile not found");
                              }
                              else {
                            if(req.body.isAdmin==true)
                                {
                                    groupValues.members.push({
                                    user:prf.user,
                                    username:m,
                                    isAdmin:true
                                });
                            groupValues.admins.push({
                                user:prf.user,
                                username:m
                            });
                            
                            }
                                else
                                groupValues.members.push({
                                    user:prf.user,
                                    username:m,
                                    isAdmin:false
                                });
                                // new Group(groupValues).save()
                                // .then(group=>{
                                //     prf.groups.unshift({
                                //         user:group._id,
                                //         name:group.name,

                                //     });
                                // })
                                // .catch(err=>console.log('Connection error 3'));
                            }
                            

                          })
                          .catch(err=>console.log('Connection error 2'));
               });
               new Group(groupValues).save()
                                .then(group=>{
                                    const arr=[];
                                   group.members.forEach(m=>{
                                       Profile.findOne({'personal.username':m.username})
                                              .then(profile=>{
                                                  profile.groups.unshift({
                                                      user:group._id,
                                                      name:group.name,
                                                      isAdmin:m.isAdmin
                                                  });
                                    profile.save()
                                           .then(profile=>{
                                               arr.push(profile);
                                           })
                                           .catch(err=>console.log("Connection error 5"));
                                              })
                                              .catch(err=>console.log('Connection error 4'));
                                   });
                            res.status(400).json(arr);
                                })
                                .catch(err=>console.log('Connection error 3'));
                                console.log(mp);

           })
           .catch(err=>console.log('Connection error 1'));
});





module.exports=router;

