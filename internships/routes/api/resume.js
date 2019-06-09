// import all the required packages
const express=require('express'),
router=express.Router(),
nodemailer=require('nodemailer'),
passport=require('passport');


// import all the required schemas
const Profile=require('../../models/Profile'),
Person=require('../../models/Person'),
InternshipProfile=require('../../models/InternshipProfile'),
Internship=require('../../models/Internship'),
Resume=require('../../models/Resume');


/*
@type - GET
@route - /api/resume/all
@desc - a route to display the resume of all interns
@access - PUBLIC
*/
router.get('/all',(req,res)=>{
Resume.find()
      .then(resume=>{
          if(!resume.length)
          return res.status(404).json({noresumetodisplay:'No resume to display'});
          res.status(200).json(resume);
      })
      .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/resume/create
@desc - a route to create the resume of an intern
@access - PRIVATE
*/
router.post('/create',passport.authenticate('jwt',{session:false}),(req,res)=>{
Profile.findOne({user:req.user._id})
       .then(profile=>{
           Resume.findOne({user:profile._id})
                 .then(resume=>{
                    if(resume)
                    return res.status(400).json({resumealreadyexists:'Resume already exists'});
                    const resumeValues={};
                    resumeValues.contact={};
                    resumeValues.user=profile._id;
                    resumeValues.name=req.user.name;
                    if(req.body.skills)
                    resumeValues.skills=req.body.skills.split(',');
                    if(req.body.country)
                    resumeValues.contact.country=req.body.country;
                    if(req.body.state)
                    resumeValues.contact.state=req.body.state;
                    if(req.body.phone)
                    resumeValues.contact.phone=req.body.phone;
                    new Resume(resumeValues).save()
                                            .then(resume=>res.status(200).json(resume))
                                            .catch(err=>console.log('Connection error'));
                 })
                 .catch(err=>console.log('Connection error'));
       })
       .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/resume/update
@desc - a route to update the resume of an intern
@access - PRIVATE
*/
router.post('/update',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               Resume.findOne({user:profile._id})
                     .then(resume=>{
                        const updatedValues={};
                        updatedValues.contact={};
                        updatedValues.user=profile._id;
                        updatedValues.name=req.user.name;
                        if(req.body.skills)
                        updatedValues.skills=req.body.skills.split(',');
                        if(req.body.country)
                        updatedValues.contact.country=req.body.country;
                        if(req.body.state)
                        updatedValues.contact.state=req.body.state;
                        if(req.body.phone)
                        updatedValues.contact.phone=req.body.phone;
                        Resume.findOneAndUpdate({user:profile._id},{$set:updatedValues},{new:true})
                              .then(resume=>res.status(200).json(resume))
                              .catch(err=>console.log('Connection error'));
                     })
                     .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
    });


/*
@type - POST
@route - /api/resume/adde
@desc - a route to add education details in the resume of an intern
@access - PRIVATE
*/
router.post('/adde',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               Resume.findOne({user:profile._id})
                     .then(resume=>{
                         const education={};
                         if(req.body.title)
                         education.title=req.body.title;
                         if(req.body.year)
                         education.year=req.body.year;
                         if(req.body.institution)
                         education.institution=req.body.institution;
                         if(req.body.percentage)
                         education.percentage=req.body.percentage;
                         resume.education.unshift(education);
                         resume.education=resume.education.sort((a,b)=>a.year-b.year);
                         resume.save()
                              .then(resume=>res.status(200).json(resume))
                              .catch(err=>console.log('Connection error'));
                     })
                     .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - DELETE
@route - /api/resume/dele-:eid
@desc - a route to remove education details in the resume of an intern
@access - PRIVATE
*/
router.delete('/dele-:eid',passport.authenticate('jwt',{session:false}),(req,res)=>{
Profile.findOne({user:req.user._id})
       .then(profile=>{
 Resume.findOne({user:profile._id})
       .then(resume=>{
       const i=resume.education.findIndex(a=>a._id.toString()==req.params.eid.toString());
       resume.education.splice(i,1);
       resume.save()
             .then(resume=>res.status(200).json(resume))
             .catch(err=>console.log('Connection error'));
            })
                 .catch(err=>console.log('Connection error'));
       })
       .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/resume/addj
@desc - a route to add job details in the resume of an intern
@access - PRIVATE
*/
router.post('/addj',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
               Resume.findOne({user:profile._id})
                     .then(resume=>{
                         const jobs={};
                         if(req.body.title)
                         jobs.title=req.body.title;
                         if(req.body.year)
                         jobs.year=req.body.year;
                         if(req.body.institution)
                         jobs.institution=req.body.institution;
                         if(req.body.text)
                         jobs.text=req.body.text;
                         resume.jobs.unshift(jobs);
                         resume.jobs=resume.jobs.sort((a,b)=>a.year-b.year);
                         resume.save()
                              .then(resume=>res.status(200).json(resume))
                              .catch(err=>console.log('Connection error'));
                     })
                     .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
});


/*
@type - DELETE
@route - /api/resume/delj-:jid
@desc - a route to remove job details in the resume of an intern
@access - PRIVATE
*/
router.delete('/delj-:jid',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user._id})
           .then(profile=>{
     Resume.findOne({user:profile._id})
           .then(resume=>{
           const i=resume.jobs.findIndex(a=>a._id.toString()==req.params.jid.toString());
           resume.jobs.splice(i,1);
           resume.save()
                 .then(resume=>res.status(200).json(resume))
                 .catch(err=>console.log('Connection error'));
                })
                     .catch(err=>console.log('Connection error'));
           })
           .catch(err=>console.log('Connection error'));
    });




// exporting all the routes
module.exports=router;










