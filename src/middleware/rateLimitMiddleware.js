const {rateLimit}=require('express-rate-limit')
const sensetiveEndPoint=rateLimit({
    windowMs:15*60*1000,
    max:10,
    legacyHeaders:false,
    standardHeaders:true,
    handler:(req,res)=>{
        console.log(`sensitive endpoint rate limit exceed for ip${req.ip}`);
        res.status(429).json({
            message:"too many request",
            success:false
        })
        
    }
})

module.exports={sensetiveEndPoint}