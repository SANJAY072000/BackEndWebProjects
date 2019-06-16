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
@route - /api/internshipprofile/all
@desc - a route to display the internship profile of all users
@access - PUBLIC
*/
router.get('/all',(req,res)=>{
    InternshipProfile.find()
                     .then(ip=>{
                            if(!ip.length)
                            return res.status(404).json({nointernshipprofile:'No internship profile of any user being found'});
                            res.status(200).json(ip);
                     })
                    .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/internshipprofile/create
@desc - a route to create the internship profile of a user
@access - PRIVATE
*/
router.post('/create',passport.authenticate('jwt',{session:false}),(req,res)=>{
    InternshipProfile.findOne({user:req.user._id})
                     .then(ip=>{
                         if(ip)
                         return res.status(400).json({internshipprofilealreadyexists:'Internship profile already exists'});
                         const ipValues={};
                         ipValues.user=req.user._id;
                        new InternshipProfile(ipValues).save()
                                 .then(ip=>res.status(200).json(ip))
                                 .catch(err=>console.log('Connection error'))
                                 .catch(err=>console.log('Connection error'));
                     })
                     .catch(err=>console.log('Connection error'));
});


/*
@type - POST
@route - /api/internshipprofile/addi
@desc - a route to add the intership in the internship profile of a user
@access - PRIVATE
*/
router.post('/addi',passport.authenticate('jwt',{session:false}),(req,res)=>{
    InternshipProfile.findOne({user:req.user._id})
                     .then(ip=>{
                         const domain={},internships={};
                         domain.category=req.body.category;
                         domain.internships=[];
                         internships.title=req.body.title;
                         internships.company=req.body.company;
                         internships.location=req.body.location;
                         internships.stipend=req.body.stipend;
                         internships.postedon=req.body.postedon;
                         internships.applyby=req.body.applyby;
                         internships.duration=req.body.duration;
                         internships.noi=req.body.noi;
                         internships.skills=req.body.skills.split(',');
                         if(ip.domain.filter(a=>a.category===domain.category).length>0)
                         {
                             const i=ip.domain.findIndex(a=>a.category===domain.category);
                             ip.domain[i].internships.unshift(internships);
                         }
                         else
                         {
                         domain.internships.unshift(internships);
                         ip.domain.unshift(domain);
                        }
                         ip.save()
                           .then(ip=>{
                            const i=ip.domain.findIndex(a=>a.category===domain.category);
                            internships.user=ip.domain[i].internships[0]._id;
                            new Internship(internships).save()
                                  .then(internships=>res.status(200).json(internships))
                                  .catch(err=>console.log('Connection error'));
                           })
                           .catch(err=>console.log(err));

                         
                     })
                     .catch(err=>console.log('Connection error'));
});




/*
@type - DELETE
@route - /api/internshipprofile/del
@desc - a route to remove the internship profile of a user
@access - PRIVATE
*/
router.delete('/del',passport.authenticate('jwt',{session:false}),(req,res)=>{
    InternshipProfile.findOneAndRemove({user:req.user._id})
                     .then(()=>res.status(200).json({internshipprofiledeleted:'Successfully removed the internship profile'}))
                     .catch(err=>console.log('Connection error'));
});



























// exporting all the routes
module.exports=router;

