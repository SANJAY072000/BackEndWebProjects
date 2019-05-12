const express=require('express'),router=express.Router(),
mongoose=require('mongoose'),passport=require('passport'),
// Load Person model
Person=require('../../models/Person'),
// Load Profile model
Profile=require('../../models/Profile'),
// Load Question model
Question=require('../../models/Question');

/*
@type GET
@route /api/questions
@desc route for showing questions
@access PUBLIC
*/
router.get('/',(req,res)=>{
    Question.find()
            .populate('user',['name','email'])
            .sort({date:"desc"})
            .then(question=>res.json(question))
            .catch(err=>console.log(err));
});

/*
@type POST
@route /api/questions
@desc route for asking questions
@access PRIVATE
*/
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const newQuestion={};
    newQuestion.user=req.user.id;
    if(req.body.textone)newQuestion.textone=req.body.textone;
    if(req.body.texttwo)newQuestion.texttwo=req.body.texttwo;
    new Question(newQuestion)
    .save()
    .then(question=>res.json(question))
    .catch(err=>console.log(err));        
});

/*
@type POST
@route /api/questions/answers/:id
@desc route for answering questions
@access PRIVATE
*/
router.post('/answers/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Question.findOne({_id:req.params.id})
            .then(question=>{
                if(question){
                const newAnswer={
                    user:req.user.id,
                    name:req.user.name,
                    text:req.body.text,
                };
                question.answers.push(newAnswer);
                question.save()
                        .then(question=>res.json(question))
                        .catch(err=>console.log(err));
            }
            else res.status(404).json({questionnotfound:"Can't answer the question"})   
            }) 
            .catch(err=>console.log(err));
   

});

/*
@type POST
@route /api/questions/upvotes/:id
@desc route for upvoting
@access PRIVATE
*/
router.post('/upvotes/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
Profile.findOne({user:req.user.id})
.then(profile=>{
    Question.findById(req.params.id)
            .then(question=>{
if(question.upvotes.filter(upvote=>upvote.user.toString()==req.user.id.toString())
.length>0)return res.status(400).json({noupvote:'User already upvoted'});
question.upvotes.push({user:req.user.id});
question.save()
        .then(question=>res.json(question))
        .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));
})
        .catch(err=>console.log(err));

});


module.exports=router;
