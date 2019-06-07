// import all the required packages
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const resumeSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'profile'
    },
    name:{
        type:String,
        required:true
    },
    education:[{
        title:{
            type:String,
            required:true
        },
        year:{
            type:Number,
            required:true
        },
        institution:{
            type:String,
            required:true
        },
        percentage:{
            type:Number,
            required:true
        },
    }],
    jobs:[{
        title:{
            type:String,
            required:true
        },
        year:{
            type:Number,
            required:true
        },
        institution:{
            type:String,
            required:true
        },
        text:{
            type:String,
        },
    }],
    internships:[{
        title:{
            type:String,
            required:true
        },
        year:{
            type:Number,
            required:true
        },
        institution:{
            type:String,
            required:true
        },
        text:{
            type:String,
        },
    }],
    projects:[{
        title:{
            type:String,
            required:true
        },
        year:{
            type:Number,
            required:true
        },
        link:{
            type:String,
            required:true
        },
        text:{
            type:String,
        },
    }],
    skills:{
        type:[String]
    },
    worksamples:[{
        title:{
            type:String
        },
        link:{
            type:String
        }
    }],
    contact:{
        country:{
            type:String
        },
        state:{
            type:String
        },
        phone:{
            type:Number
        },
    },
    Date:{
        type:Date,
        default:Date.now
    }
});


// exporting the schema
module.exports=mongoose.model('resume',resumeSchema);































