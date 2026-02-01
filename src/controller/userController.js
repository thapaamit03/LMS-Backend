const User = require("../models/user");
const bcrypt=require('bcryptjs');
const { uploadToCloudinary } = require("../service/UploadCloud");
const jwt=require('jsonwebtoken')

const registerUser=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(400).json({
                message:"all fileds are required",
                success:false
            })
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message:"user already exist",
                success:false
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
    
        const imageUrl=req.file;
        if(!imageUrl){
            return res.status(400).json({
                message:"image file is required",
                success:false
            })
        }
        const {url,publicId}=await uploadToCloudinary(imageUrl);
        
        await User.create({
            username,
            email,
            password:hashedPassword,
            coverImage:url,
    
        })
    
        res.status(201).json({
            message:"user register successfully",
            success:true,
            
        })
    } catch (error) {
        res.status(500).json({
            message:"error while registering user",
            success:false
        })
    }
}


const loginUser=async(req,res)=>{
   try {
     const{email,password}=req.body;
     if(!email||!password){
         return res.status(400).json({
             message:"email and password is required",
             success:false
         })
     }
     const user=await User.findOne({email});
     if(!user){
         return res.status(404).json({
             message:'user not found',
             success:false
         })
     }
     const isPasswordMatched=await bcrypt.compare(password,user.password);
     if(!isPasswordMatched){
         return res.status(401).json({
             message:'incorrect password',
             success:false
         })
     }

     const accessToken=jwt.sign({id:user._id,roles:user.roles},
        process.env.JWT_SECRET,{expiresIn:'1h'}
     )
     
     res.cookie('accessToken',accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV,
        maxAge:60*60*1000
     })

     res.status(200).json({
         message:'user logged in successfully',
         success:true,
         user
     })
 
   } catch (error) {
        res.status(500).json({
            message:'internal server error',
            success:false
        })
   }
}

module.exports={loginUser,registerUser}