const { createBook,
     updateBook,
      deleteBook, 
      borrowBook, 
      returnBook, 
      getAllBook } = require('../controller/BookController');
const validateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

const router=require('express').Router();


router.post(
    '/create',
    validateToken,
    upload.single('coverImage'),
    createBook);
router.patch(
    '/update/:id',
    validateToken,
    updateBook);
router.delete(
    '/delete/:id',
    validateToken,
    deleteBook);
router.post(
    '/borrow/:id'
    ,validateToken
    ,borrowBook);
router.post(
    '/return/:id',
    validateToken,
    returnBook);
router.get(
    '/',
    validateToken,
    getAllBook)
