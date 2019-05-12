const router=require('express').Router(),
passport=require('passport'),
Person=require('../../models/Person'),
Profile=require('../../models/Profile'),
Message=require('../../models/Message');


/*
@type - POST
@route - /api/message-:username
@desc - a route to send message
@access - PRIVATE
*/
router.post('/-:username',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Message.findOne({user:req.user._id})
           .then(message=>{
               if(!message){
                const mesgValues={};
mesgValues.user=req.user._id;
new Message(mesgValues)
.save()
.then(message=>{
Profile.findOne({'personal.username':req.params.username})
.then(profile=>{
if(profile){
const sent={};
if(req.body.text)
sent.text=req.body.text;
sent.user=profile.user;
message.sent.unshift(sent);
message.save()
.then(message=>{
    Message.findOne({user:profile.user})
           .then(message=>{
               if(!message){
                const inbox={},receive={};
receive.user=profile.user;
new Message(receive).save()
                    .then(message=>{
                        if(req.body.text)
                        inbox.text=req.body.text;
                        inbox.user=req.user._id;
                        message.inbox.unshift(inbox);
                        message.save()
                               .then(message=>res.json(message))
                               .catch(err=>console.log('Connection error'));
                    })
                    .catch(err=>console.log('Connection error'));
               }
               else{
                const inbox={};
                if(req.body.text)
                        inbox.text=req.body.text;
                        inbox.user=req.user._id;
                        message.inbox.unshift(inbox);
                        message.save()
                               .then(message=>res.json(message))
                               .catch(err=>console.log('Connection error'));
               }
           })
           .catch(err=>console.log('Connection error'));

                           })
                           .catch(err=>console.log('Connection error'));
                    }
                    else{
                        res.status(404).json({profileerror:'Profile not found to send message'});
                    }
               })
               .catch(err=>console.log('Connection error'))
    })
    .catch(err=>console.log('Connection error'));
               }
             else{
                
Profile.findOne({'personal.username':req.params.username})
.then(profile=>{
if(profile){
const sent={};
if(req.body.text)
sent.text=req.body.text;
sent.user=profile.user;
message.sent.unshift(sent);
message.save()
.then(message=>{
    Message.findOne({user:profile.user})
           .then(message=>{
               if(!message){
                const inbox={},receive={};
receive.user=profile.user;
new Message(receive).save()
                    .then(message=>{
                        if(req.body.text)
                        inbox.text=req.body.text;
                        inbox.user=req.user._id;
                        message.inbox.unshift(inbox);
                        message.save()
                               .then(message=>res.json(message))
                               .catch(err=>console.log('Connection error'));
                    })
                    .catch(err=>console.log('Connection error'));
               }
               else{
                const inbox={};
                if(req.body.text)
                        inbox.text=req.body.text;
                        inbox.user=req.user._id;
                        message.inbox.unshift(inbox);
                        message.save()
                               .then(message=>res.json(message))
                               .catch(err=>console.log('Connection error'));
               }
           })
           .catch(err=>console.log('Connection error'));

                           })
                           .catch(err=>console.log('Connection error'));
                    }
                    else{
                        res.status(404).json({profileerror:'Profile not found to send message'});
                    }
               })
               .catch(err=>console.log('Connection error'))
               }
              })
           .catch(err=>console.log('Connection error'));


});


/*
@type - GET
@route - /api/message/all
@desc - a route to display all message profiles
@access - PUBLIC
*/
router.get('/all',(req,res)=>{
    Message.find()
           .populate('user',['name','email'])
           .then(message=>res.json(message))
           .catch(err=>console.log('Connection error'));
});


/*
@type - GET
@route - /api/message
@desc - a route to display a message profile
@access - PRIVATE
*/
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Message.findOne({user:req.user._id})
    .populate('user',['name','email'])
    .then(message=>{
       
                if(message.inbox.length>0){
               message.inbox.forEach(a=>{
                   a.isseen=true;
                   Message.findOne({user:a.user})
           .populate('user',['name','email'])
                          .then(message=>{
                              message.sent.forEach(a=>{
                                  if(a.user.toString()===req.user._id.toString())
                                  a.isseen=true;
                              });
                              message.save()
                                     .then(message=>console.log('Saved successfully'))
                                     .catch(err=>console.log('Connection error'));
                          })
                          .catch(err=>console.log('Connection error'));
               });
               message.save()
                      .then(message=>res.json(message))
                      .catch(err=>console.log('Connection error'));
                    }
                    else res.status(400).json({inboxerror:'Inbox is empty'});
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - DELETE
@route - /api/message/sent-:username
@desc - a route to delete a sent message
@access - PRIVATE
*/
router.delete('/sent-:username',passport.authenticate('jwt',{session:false}),(req,res)=>{
Message.findOne({user:req.user._id})
       .populate('user',['name','email'])
       .then(message=>{
           if(message.sent.length>0){
            Profile.findOne({'personal.username':req.params.username})
            .populate('user',['name','email'])
            .then(profile=>{
            if(!profile)
            return res.status(404).json({profileerror:'No messages are there from this username'});
                let i,j;
                i=message.sent.findIndex(a=>a.user.toString()===profile.user.toString());
                message.sent.splice(i,1);
                message.save()
                .then(message=>res.json(message))
                .catch(err=>console.log('Connection error')); 
            })
            .catch(err=>console.log('Connection error'));
           }
           else res.status(400).json({senterror:'No messages sent yet'});
       })
       .catch(err=>console.log('Connection error'));
});


/*
@type - DELETE
@route - /api/message/inbox-:username
@desc - a route to delete a received message
@access - PRIVATE
*/
router.delete('/inbox-:username',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Message.findOne({user:req.user._id})
           .populate('user',['name','email'])
           .then(message=>{
               if(message.inbox.length>0){
                Profile.findOne({'personal.username':req.params.username})
                .populate('user',['name','email'])
                .then(profile=>{
                if(!profile)
                return res.status(404).json({profileerror:'No messages are there from this username'});
                    let i,j;
                    i=message.inbox.findIndex(a=>a.user.toString()===profile.user.toString());
                    message.inbox.splice(i,1);
                    message.save()
                    .then(message=>res.json(message))
                    .catch(err=>console.log('Connection error')); 
                })
                .catch(err=>console.log('Connection error'));
               }
               else res.status(400).json({inboxerror:'No messages in inbox'});
           })
           .catch(err=>console.log('Connection error'));
    });





module.exports=router;








