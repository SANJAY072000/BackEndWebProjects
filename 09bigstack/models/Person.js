const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const PersonSchema=new Schema({
name:
{
    type:String,
    required:true,
},
email:
{
    type:String,
    required:true, 
},
password:
{
    type:String,
    required:true, 
},
username:
{
    type:String,
},
profilepic:
{
    type:String,
},
date:
{
    type:Date,
   defaut:Date.now
},
});
module.exports=mongoose.model("myperson",PersonSchema);
