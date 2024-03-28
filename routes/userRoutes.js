import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.route('/register').post(userController.createUser);

export default router;
