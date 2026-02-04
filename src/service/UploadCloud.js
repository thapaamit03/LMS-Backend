const { error, Logger } = require('winston')
const cloudinary=require('../config/cloudinaryConfig')
const uploadToCloudinary=async(file)=>{

    return new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream(
            {
                resource_type:'auto'
            },(error,result)=>{
                if(error){
                    console.error('error while uploading',error)
                    reject(error)
                }else{
                    resolve(result)
                }
            }
        )
        uploadStream.end(file.buffer);
    })

}

const deleteFromCloudinary=async(publicId)=>{
    try {
        const deletedImage=await cloudinary.uploader.destroy(publicId,{
            resource_type:'auto'
        })
        return deletedImage;
    } catch (error) {
        console.error("error wile deleting image from cloudinary",error);
    }
}
module.exports={uploadToCloudinary,deleteFromCloudinary}