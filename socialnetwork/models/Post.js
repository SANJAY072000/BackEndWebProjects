const mongoose=require('mongoose'),
Schema=mongoose.Schema,
PostSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'person'
    },
    posts:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'profile'
            },
            bod:{
                type:String,
            },
            date:{
                type:Date,
                default:Date.now
            },
            upvotes:[
                {
                    user:{
                        type:Schema.Types.ObjectId,
                        ref:'person'
                    }
                }
            ],
            downvotes:[
                {
                    user:{
                        type:Schema.Types.ObjectId,
                        ref:'person'
                    }
                }
            ]
        }
    ]
});


module.exports=mongoose.model('post',PostSchema);
