// import all the required packages
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const internshipSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    stipend:{
        type:String,
        required:true
    },
    postedon:{
        type:String,
        required:true
    },
    applyby:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    noi:{
        type:Number,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    Date:{
        type:Date,
        default: Date.now
    }, 
});


// exporting the schema
module.exports=mongoose.model('internshipschema',internshipSchema);







































