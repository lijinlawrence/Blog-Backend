
import express  from 'express'
import { createPost, deletePost, favoritePost, getAllPosts, getSinglePost, getUserPost } from '../controller/postController.js'
import extractUserId  from '../middleware/jwtMiddleware.js'
const router = express.Router()

router.post('/',extractUserId,createPost)

router.get('/',getAllPosts)
router.get('/:id',getSinglePost)
router.get('/userPost/:userId',extractUserId,getUserPost)
router.delete('/:id',extractUserId,deletePost)
router.post ('/favorite/:id',extractUserId,favoritePost)






export default router


