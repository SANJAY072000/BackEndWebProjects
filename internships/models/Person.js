// import all the required packages
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const personSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});


// exporting the schema
module.exports=mongoose.model('person',personSchema);



















