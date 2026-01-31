const mongoose=require('mongoose');

const bookSchema=mongoose.Schema({

    
    author:{
        type:[String]
    },
    title:{
        type:String,
        required:true
    },
   status:{
    type:String,
    enum:['available','unavailable'],
    default:'available'
   },
   coverImage:{
    type:String
   },
   totalCopies:{
    type:Number,
    min: 0
   },
   availableCopies:{
    type:Number,
    min:0
   },
   isbn:{
    type:String,
    unique:true
   }


},{timestamps:true})

const Book=mongoose.model('Book',bookSchema);

module.exports=Book;