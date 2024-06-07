
import express  from 'express'
import {  createPost, deletePost, favoritePost,  getAllPosts,  getSinglePost, getUserFavoritePosts, getUserPost, updatePost } from '../controller/postController.js'
import extractUserId  from '../middleware/jwtMiddleware.js'
const router = express.Router()

router.post('/',extractUserId,createPost)

router.get('/',getAllPosts)
router.get('/:id',getSinglePost)
router.get('/userPost/:userId',extractUserId,getUserPost)
router.delete('/:id',extractUserId,deletePost)
router.put('/updatePost/:id', extractUserId, updatePost);

router.put('/favorite/:id', extractUserId, favoritePost);
router.get('/favorites', extractUserId, getUserFavoritePosts);








export default router


