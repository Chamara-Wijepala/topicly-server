import express from 'express';
import postController from '../controllers/postController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router
	.route('/')
	.get(postController.getAllPosts)
	.post(verifyJWT, postController.createPost);

router
	.route('/:id')
	.get(postController.getPost)
	.patch(verifyJWT, postController.updatePost)
	.delete(verifyJWT, postController.deletePost);

export default router;
