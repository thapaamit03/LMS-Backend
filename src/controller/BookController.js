const Book = require("../models/book");

const IssueBorrow = require("../models/issueBorrow");
const {uploadToCloudinary,deleteFromCloudinary} = require("../service/UploadCloud");
const calculateFine = require("../utils/calculateFine");


const returnBook=async(req,res)=>{
    const issue=await IssueBorrow.findById(req.params.id).populate('book');
    
    if(!issue){
        return res.status(400).json({message:'Issue record not found'})
    }
    if(issue.returnDate){
        return res.status(400).json({
            message:"book already returned"
        })
    }
    issue.returnDate=new Date();

    const fine=calculateFine(issue.dueDate,issue.returnDate)

    issue.fineAmount=fine;
    issue.status=fine > 0 ? 'overdue':'returned'
    
    issue.book.availableCopies+=1;
    issue.book.status='available'
    await issue.save()
    await issue.book.save()

    res.status(200).json({
        message:'book returned successfully',
        fine
    })

}
const MAX_BOOK_PER_USERS=3;
const BORROW_DAYS=7;
const borrowBook=async(req,res)=>{

   try {
     const {userId}=req.user;
     const activeBorrows=await IssueBorrow.countDocuments({
         userId:userId,
         returnDate:null
     })
 
     if(activeBorrows >=MAX_BOOK_PER_USERS){
         return res.status(400).json({
             message:"Borrow limit reached"
         })
     }
     const bookId=req.params.id;
     const book=await Book.findById(bookId);
     if(!book){
         return res.status(404).json({message:"book not found"})
     }
 
     if(book.availableCopies<=0){
         return res.status(404).json({message:"Book not available"})
     }
     
     const dueDate=new Date();
     dueDate.setDate(dueDate.getDate()+BORROW_DAYS);
     const issue=await IssueBorrow.create({
         user:userId,
         book:bookId,
         issueDate:new Date(),
         returnDate:null,
         dueDate:dueDate,
         status:'issued'
     })
 
     book.availableCopies -=1;
     if(book.availableCopies === 0){
         book.status='unavailable'
     }
     await book.save();
 
     res.status(200).json({
         message:'book issued successfully',
         issue
     })
   } catch (error) {
        res.status(500).json({
            message:'internal server error',
            error:error.message
        })
   }
}

const createBook=async(req,res)=>{

    try {
        const{roles}=req.user;
        
        if(roles!=='admin'){
            return res.status(400).json({
                message:'admin can only create book',
                success:false
            })
        }
        const file=req.file;
        if(!file){
            return res.status(400).json({message:'book image is required'})
        }
        const {title,author,totalCopies}=req.body;
        
        if(!title||!author||!totalCopies){
            return res.status(400).json({
                message:'all book fields are required',
                success:false
            })
        }
        const {url,publicId}=await uploadToCloudinary(file);
    
        const book=await Book.create({
            title,
            author,
            totalCopies,
            coverImage:{
                url:url,
                publicId:publicId
            },
            availableCopies:totalCopies,
            status:'available'
    
        })
    
        res.status(201).json({
            message:'book created sucessfully',
            book,
            success:true
        })
    
    } catch (error) {
        res.status(500).json({
            message:'internal server error',
            success:false
        })
    }
}

const updateBook=async(req,res)=>{
   try {
     const {roles}=req.user;
     if(roles !== 'admin'){
         return res.status(403).json({message:'admin roles is required'})
     }
 
     const book=await Book.findById(req.params.id)
     if(!book){
         return res.status(404).json({
             message:'book not found',
             success:false
         })
     }
     const{title,author,totalCopies}=req.body;
     if(title) book.title=title;
     if(author) book.author=author;
 
     if(book.availableCopies !== undefined){
         const diff=totalCopies-book.totalCopies;
         book.totalCopies=totalCopies;
         book.availableCopies +=diff
     }
 
     book.status=book.availableCopies > 0 ?'available':'unavailable'
 
     await book.save();
     res.status(200).json({
         message:'book updated successfully',
         success:true,
         book
     })
   } catch (error) {
    res.status(500).json({
        message:'internal server error',
        success:false
    })
   }
}

const deleteBook=async(req,res)=>{
    try {
        const bookId=req.params.id;
        const {roles}=req.user;
        if(roles!=='admin'){
            return res.status(403).json({
                message:'admin roles is required',
                success:false
            })
        }
        const book=Book.findById(bookId);
        if(!book){
            return res.status(404).json({
                message:'book not found',
                success:false
            })
        }
        if(book.coverImage?.publicId){
            await deleteFromCloudinary(book.coverImage.publicId)
        }

        const deletedBook=await Book.findByIdAndDelete(bookId);
        
        res.status(200).json({
            message:'book deleted successfully',
            success:true,
            deletedBook
        })
    } catch (error) {
        res.status(500).json({
            message:'internal server error',
            success:false
        })
    }
}

const getAllBook=async(req,res)=>{

  try {
     const {page=1,limit=10}=req.query;
     const pageNumber=Number(page);
     const limitNumber=Number(limit);
      const skip=(pageNumber-1)*limitNumber;

      const books=await Book.find({}).skip(skip).limit(limitNumber).sort({createdAt:-1});
      const total=await Book.countDocuments()
  
      res.status(200).json({
          message:"book fetched successfully",
          success:true,
          pageNumber,
          totalBooks:total,
          books
  
      })
  } catch (error) {
    res.status(500).json({
        message:'internal server error',
        success:false
    })
  }
}


module.exports={borrowBook,returnBook,createBook,deleteBook,updateBook,getAllBook}