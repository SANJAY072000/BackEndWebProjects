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
    groupValues.admins=[],groupValues.members=[];
    const arr=[];
    let mp=new Map(),m;
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
              m=req.body.members;
                   Profile.findOne({'personal.username':m})
                          .then(prf=>{
                              if(!prf)
                              mp.set(m,"Profile not found");
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
                                else{
                                groupValues.members.push({
                                    user:prf.user,
                                    username:m,
                                    isAdmin:false
                                });
                            }
                            }
                          })
                          .catch(err=>console.log('Connection error 2'));
               new Group(groupValues).save()
                                .then(group=>{
                                   group.members.forEach(m=>{
                                       Profile.findOne({'personal.username':m.username})
                                              .then(pro=>{
                                                  pro.groups.unshift({
                                                      user:group._id,
                                                      name:group.name,
                                                      isAdmin:m.isAdmin
                                                  });
                                        pro.save()
                                           .then(pr=>arr.push(pr))
                                           .catch(err=>console.log("Connection error 5"));
                                              })
                                              .catch(err=>console.log('Connection error 4'));
                                   });
                                })
                                .catch(err=>console.log('Connection error 3'));
                                console.log(mp + arr);
           })
           .catch(err=>console.log('Connection error 1'));
});


/*
@type - DELETE
@route - /api/group/leave-:group_id
@desc - a route to leave a group
@access - PRIVATE
*/
router.delete('/leave-:group_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
            const i=profile.groups.findIndex(a=>a._id.toString()==req.params.group_id.toString());
            profile.groups.splice(i,1);
            profile.save()
                   .then(profile=>res.json(profile))
                   .catch(err=>console.log('Connection error 2'));
           })
           .catch(err=>console.log('Connection error 1'));
});

module.exports=router;

