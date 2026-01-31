const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        select:false    //hide pw by default
    },
    roles:{
        type:String,
        enum:['admin','member','librarian'],
        default:'memeber'
    },
    avatar:{
        type:String
    },
    status:{
        type:String,
        enum:['active','blocked','suspend'],
        default:'active'
    }
},{timestamps:true})

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();

    this.password=await bcrypt.hash(this.password,10)
    return next();
})

const User=mongoose.model('User',userSchema);

module.exports=User;