// import all the required packages
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const profileSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'person'
    },
    applications:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'internshipschema'
        },
        title:{
            type:String,
            required:true
        },
        company:{
            type:String,
            required:true
        },
        status:{
            type:String,
            default:'Applied'
        },
        noa:{
            type:Number,
            required:true
        },
    }],
    preferences:[{
        pn:{
            type:Number,
            required:true
        },
        title:{
            type:String,
            required:true
        }
    }],
    availability:{
        type:String,
        required:true
    },
    locationpreferences:[{
        pn:{
            type:Number,
            required:true
        },
        location:{
            type:String,
            required:true
        }
    }],
    Date:{
        type:Date,
        default:Date.now
    }
});


// exporting the schema
module.exports=mongoose.model('profile',profileSchema);



































