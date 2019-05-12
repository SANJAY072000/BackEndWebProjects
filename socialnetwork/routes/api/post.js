const express=require('express'),
router=express.Router(),
passport=require('passport'),
Person=require('../../models/Person'),
Profile=require('../../models/Profile'),
Message=require('../../models/Message'),
Post=require('../../models/Post');


/*
@type - GET
@route - /api/post
@desc - a route to see posts
@access - PRIVATE
*/
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findOne({user:req.user._id})
        .populate('user',['name','email'])
        .then(post=>{
            if(!post)
            return res.status(404).json({posterror:'No Posts yet'});
            res.json(post);
        })
        .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/post
@desc - a route to send posts in own timeline
@access - PRIVATE
*/
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findOne({user:req.user._id})
        .then(post=>{
            if(!post){
                Profile.findOne({user:req.user._id})
                    .then(profile=>{
                        if(!profile)
                        return res.status(404).json({profileerror:'No profile found for posts'});
                        const postValues={},posts={};
                        postValues.user=req.user._id;
                        if(req.body.bod)
                        posts.bod=req.body.bod;
                        posts.user=profile._id;
                        postValues.posts=[];
                        postValues.posts.unshift(posts);
                        new Post(postValues).save()
                                  .then(post=>{
                                    const timeline={};
                                    timeline.user=profile._id;
                                    timeline.bod=req.body.bod;
                                    profile.timeline.unshift(timeline);
                                    profile.save()
                                           .then(profile=>res.json(profile))
                                           .catch(err=>console.log('Connection error'));
                                  })
                                  .catch(err=>console.log('Connection error'));
                    })
                       .catch(err=>console.log('Connection error'));
            }
            else{
                const posts={};
                Profile.findOne({user:req.user._id})
                       .then(profile=>{
                           if(req.body.bod)
                           posts.bod=req.body.bod;
                           posts.user=profile._id;
                           post.posts.unshift(posts);
                           post.save()
                               .then(post=>{
                                const timeline={};
                                timeline.user=profile._id;
                                timeline.bod=req.body.bod;
                                profile.timeline.unshift(timeline);
                                profile.save()
                                       .then(profile=>res.json(profile))
                                       .catch(err=>console.log('Connection error'));
                               })
                               .catch(err=>console.log('Connection error'));
                       })
                       .catch(err=>console.log('Connection error'))
            }
        })
        .catch(err=>console.log('Connection error'))
});


/*
@type - POST
@route - /api/post-:username
@desc - a route to send posts in others timeline
@access - PRIVATE
*/
router.post("/-:username",passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findOne({user:req.user._id})
        .then(post=>{
            if(!post){
                Profile.findOne({'personal.username':req.params.username})
                .then(profile=>{
                    if(!profile)
                    return res.status(404).json({profileerror:'No profile found for posts'});
                    const postValues={},posts={};
                    postValues.user=req.user._id;
                    if(req.body.bod)
                    posts.bod=req.body.bod;
                    posts.user=profile._id;
                    postValues.posts=[];
                    postValues.posts.unshift(posts);
                    new Post(postValues).save()
            .then(post=>{
                Profile.findOne({user:req.user._id})
                       .then(prf=>{
                        const timeline={};
                        timeline.user=prf._id;
                        timeline.bod=req.body.bod;
                        profile.timeline.unshift(timeline);
                        profile.save()
                               .then(profile=>res.json(profile))
                               .catch(err=>console.log('Connection error')); 
                       })
                       .catch(err=>console.log('Connection error'));
            })
                                        .catch(err=>console.log('Connection error'));

                })
                       .catch(err=>console.log('Connection error'));
            }
            else{
                const posts={};
                Profile.findOne({'personal.username':req.params.username})
                       .then(profile=>{
                        if(req.body.bod)
                        posts.bod=req.body.bod;
                        posts.user=profile._id;
                        post.posts.unshift(posts);
                        post.save()
                            .then(post=>{
                            Profile.findOne({user:req.user._id})
                       .then(prf=>{
                        const timeline={};
                        timeline.user=prf._id;
                        timeline.bod=req.body.bod;
                        profile.timeline.unshift(timeline);
                        profile.save()
                               .then(profile=>res.json(profile))
                               .catch(err=>console.log('Connection error')); 
                       })
                       .catch(err=>console.log('Connection error'));
                                       })
                                       .catch(err=>console.log('Connection error'));
                              
                       })
                       .catch(err=>console.log('Connection error'));
            }
        })
        .catch(err=>console.log('Connection error'));
});


/*
@type - DELETE
@route - /api/post
@desc - a route to delete posts in own timeline
@access - PRIVATE
*/
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findOne({user:req.user._id})
        .then(post=>{
    Profile.findOne({user:req.user._id})
    .then(profile=>{
      if(profile.timeline.length>0){
          const i=profile.timeline.findIndex(a=>a.user.toString()==profile._id.toString());
        profile.timeline.splice(i,1);
        profile.save()
               .then(profile=>res.json(profile))
               .catch(err=>console.log('Connection error'));
            }
            else
            res.status(404).json({timelineerror:'Empty timeline'});

    })
    .catch(err=>console.log('Connection error'));
})
        .catch(err=>console.log('Connection error'));
});


/*
@type - DELETE
@route - /api/post-:username
@desc - a route to delete specific posts in timeline
@access - PRIVATE
*/
router.delete('/-:username',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(prf=>{
            Profile.findOne({'personal.username':req.params.username})
            .then(profile=>{
             if(prf.timeline.length>0)
             {
                 const i=prf.timeline.findIndex(a=>a.user.toString()==profile._id.toString());
                 prf.timeline.splice(i,1);
                 prf.save()
                        .then(prf=>res.json(prf))
                        .catch(err=>console.log('Connection error'));
             }
             else
             res.status(404).json({timelineerror:'Empty timeline'});
            })
            .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
   
});


/*
@type - GET
@route - /api/post/upvote/:username-:post_id
@desc - a route to upvote the posts
@access - PRIVATE
*/
router.get('/upvote/:username-:post_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
Profile.findOne({'personal.username':req.params.username})
       .then(profile=>{
    if(!profile)
    return res.status(404).json({profileerror:'No profile found for upvotes'});
const i=profile.timeline.findIndex(a=>a._id.toString()==req.params.post_id.toString());
if(profile.timeline[i].upvotes.filter(a=>a.user.toString()==req.user._id.toString()).length>0)
return res.status(400).json({alreadyupvoted:'You have already upvoted'});
profile.timeline[i].upvotes.unshift({
    user:req.user._id
});
profile.save()
       .then(profile=>{
        Profile.findOne({_id:profile.timeline[i].user})
        .then(prf=>{
            Post.findOne({user:prf.user})
                .then(post=>{
                const arr=post.posts.filter(a=>a.user.toString()==profile._id.toString());
                let j,min,b=[];
                for(j=0;j<arr.length;++j){
                    min=(arr[j].date-profile.timeline[i].date)/1000;
                    b.unshift(min);
                }
                for(j=0;j<b.length;++j)
                if(Math.min(...b)==b[j])
                {
                    let k=post.posts.findIndex(a=>a._id.toString()==arr[j]._id.toString());
                    post.posts[k].upvotes.unshift({
                        user:req.user._id
                    });
                    post.save()
                        .then(post=>res.json(post))
                        .catch(err=>console.log('Connection error'));
                }
                })
                .catch(err=>console.log('Connection error'));
        })
        .catch(err=>console.log('Connection error'));
       })
       .catch(err=>console.log('Connection error'));



        
       })
       .catch(err=>console.log('Connection error'));
});


/*
@type - GET
@route - /api/post/downvote/:username-:post_id
@desc - a route to downvote the posts
@access - PRIVATE
*/
router.get('/downvote/:username-:post_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({'personal.username':req.params.username})
           .then(profile=>{
        if(!profile)
        return res.status(404).json({profileerror:'No profile found for downvotes'});
    const i=profile.timeline.findIndex(a=>a._id.toString()==req.params.post_id.toString());
    if(profile.timeline[i].downvotes.filter(a=>a.user.toString()==req.user._id.toString()).length>0)
    return res.status(400).json({alreadydownvoted:'You have already downvoted'});
    profile.timeline[i].downvotes.unshift({
        user:req.user._id
    });
    profile.save()
           .then(profile=>{
            Profile.findOne({_id:profile.timeline[i].user})
            .then(prf=>{
                Post.findOne({user:prf.user})
                    .then(post=>{
                    const arr=post.posts.filter(a=>a.user.toString()==profile._id.toString());
                    let j,min,b=[];
                    for(j=0;j<arr.length;++j){
                        min=(arr[j].date-profile.timeline[i].date)/1000;
                        b.unshift(min);
                    }
                    for(j=0;j<b.length;++j)
                    if(Math.min(...b)==b[j])
                    {
                        let k=post.posts.findIndex(a=>a._id.toString()==arr[j]._id.toString());
                        post.posts[k].downvotes.unshift({
                            user:req.user._id
                        });
                        post.save()
                            .then(post=>res.json(post))
                            .catch(err=>console.log('Connection error'));
                    }
                    })
                    .catch(err=>console.log('Connection error'));
            })
            .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
    
    
    
            
           })
           .catch(err=>console.log('Connection error'));
    });
    
   
/*
@type - DELETE
@route - /api/post/upvote/:username-:post_id
@desc - a route to reset the upvote of the posts
@access - PRIVATE
*/
router.delete('/upvote/:username-:post_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
Profile.findOne({'personal.username':req.params.username})
.then(profile=>{
if(!profile)
return res.status(404).json({profileerror:'No profile found to reset upvotes'});
const i=profile.timeline.findIndex(a=>a._id.toString()==req.params.post_id.toString());
if(!(profile.timeline[i].upvotes.filter(a=>a.user.toString()==req.user._id.toString()).length>0))
return res.status(400).json({notupvoted:'You have not upvoted yet to reset upvotes'});  
const j=profile.timeline[i].upvotes.findIndex(a=>a.user.toString()==req.user._id.toString());
profile.timeline[i].upvotes.splice(j,1);
profile.save()
       .then(profile=>{
        Profile.findOne({_id:profile.timeline[i].user})
        .then(prf=>{
        Post.findOne({user:prf.user})
            .then(post=>{
            const j=post.posts.findIndex(a=>a.user.toString()==profile._id.toString());
            const k=post.posts[j].upvotes.findIndex(a=>a.user.toString()==req.user._id.toString());
            post.posts[j].upvotes.splice(k,1);
            post.save()
                .then(post=>res.json(post))
                .catch(err=>console.log('Connection error'));
            })
            .catch(err=>console.log('Connection error'));  
        })
               .catch(err=>console.log('Connection error'));
       })
       .catch(err=>console.log('Connection error'));

    })
    .catch(err=>console.log('Connection error'));    
});


/*
@type - DELETE
@route - /api/post/downvote/:username-:post_id
@desc - a route to reset the downvote of the posts
@access - PRIVATE
*/
router.delete('/downvote/:username-:post_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({'personal.username':req.params.username})
    .then(profile=>{
    if(!profile)
    return res.status(404).json({profileerror:'No profile found to reset downvotes'});
    const i=profile.timeline.findIndex(a=>a._id.toString()==req.params.post_id.toString());
if(!(profile.timeline[i].downvotes.filter(a=>a.user.toString()==req.user._id.toString()).length>0))
    return res.status(400).json({notdownvoted:'You have not downvoted yet to reset downvotes'});  
    const j=profile.timeline[i].downvotes.findIndex(a=>a.user.toString()==req.user._id.toString());
    profile.timeline[i].downvotes.splice(j,1);
    profile.save()
           .then(profile=>{
            Profile.findOne({_id:profile.timeline[i].user})
            .then(prf=>{
        Post.findOne({user:prf.user})
        .then(post=>{
        const j=post.posts.findIndex(a=>a.user.toString()==profile._id.toString());
        const k=post.posts[j].downvotes.findIndex(a=>a.user.toString()==req.user._id.toString());
        post.posts[j].downvotes.splice(k,1);
                post.save()
                    .then(post=>res.json(post))
                    .catch(err=>console.log('Connection error'));
                })
                .catch(err=>console.log('Connection error'));  
            })
                   .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
    
        })
        .catch(err=>console.log('Connection error'));    
    });



module.exports=router;
