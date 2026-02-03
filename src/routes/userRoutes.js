const { loginUser, registerUser } = require('../controller/userController');
const upload = require('../middleware/multerMiddleware');

const router=require('express').Router();

router.post('/login',loginUser);
router.post('/register',upload.single('coverImage'),registerUser);