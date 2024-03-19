import asyncHandler from 'express-async-handler';
import { Post } from '../models/Post.js';

const getAllPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find();

	if (!posts) {
		return res.status(404).json({ message: 'No posts found!' });
	}

	return res.status(200).json(posts);
});

const getPost = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const post = await Post.findById(id);

	if (!post) {
		return res.status(500).json({ message: 'Post not found!' });
	}

	return res.status(200).json(post);
});

const createPost = asyncHandler(async (req, res) => {
	const { username, title, body } = req.body;

	if (!username || !title || !body) {
		return res.status(400).json({ message: 'All fields are required!' });
	}

	const newPost = { username, title, body };
	const post = await Post.create(newPost);

	return res.status(201).json(post.id);
});

const updatePost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { title, body } = req.body;

	if (!title || !body) {
		return res.status(400).json({ message: 'All fields are required!' });
	}

	const result = await Post.findByIdAndUpdate(id, req.body);

	if (!result) {
		return res.status(404).json({ message: 'Post not found!' });
	}

	return res.sendStatus(200);
});

const deletePost = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const result = await Post.findByIdAndDelete(id);

	if (!result) {
		return res.status(404).json({ message: 'Post not found!' });
	}

	return res.sendStatus(200);
});

export default {
	getAllPosts,
	getPost,
	createPost,
	updatePost,
	deletePost,
};
