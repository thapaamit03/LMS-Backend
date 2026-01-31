const mongoose=require('mongoose');

const issueBorrowSchema=mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book'
    },
    issueDate:{
        type:Date,
        default: Date.now
    },
    dueDate:{
    type:Date,
    required:true
    },
    returnDate:{
        type:Date
    },
    status:{
        type:String,
        enum:['issued','returned','overdue']
    },
    fineAmount:{
        type:Number,
        default:0
    }
},{timestamps:true})

funtion
issueBorrowSchema.methods.updateStatus=function(){

    if(!this.returnDate && new Date() > this.dueDate) {
        this.status='overdue'
    }  
}




const IssueBorrow=mongoose.model('IssueBorrow',issueBorrowSchema)

module.exports=IssueBorrow;