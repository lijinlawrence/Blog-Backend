
import express  from 'express'
import { createUser, deleteAllUsers, getAllUsers, getUserProfile, loginUser, updateUserProfile } from '../controller/userController.js'
import extractUserId from '../middleware/jwtMiddleware.js'
import upload from '../middleware/multerMiddleWare.js'
import multerConfig from '../middleware/multerMiddleWare.js'

const router = express.Router( )

router.post('/',createUser)
router.post('/login',loginUser)
router.put('/profile', extractUserId,multerConfig.single("profileImage"), updateUserProfile);
router.get('/profile', extractUserId, getUserProfile);


router.get('/', getAllUsers);
router.delete('/delete', deleteAllUsers);









export default router