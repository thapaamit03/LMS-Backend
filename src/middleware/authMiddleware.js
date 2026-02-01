const jwt=require('jsonwebtoken')

const validateToken=async(req,res,next)=>{

  try {
      const authHeader=req.headers.authorization;

      if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({
              message:'authorization token is required',
              success:false
          }
          )
      }
      const token=authHeader&&authHeader.split(' ')[1];
    
      const decoded=jwt.verify(token,process.env.JWT_SECRET)
      
      req.user={userId:decoded.id,roles:decoded.roles}
      next()
  } catch (error) {
    res.status(500).json({message:'error while  token validation ',success:false})
  }
}

module.exports=validateToken