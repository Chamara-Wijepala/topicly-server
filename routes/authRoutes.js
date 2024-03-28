import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.route('/').post(authController.handleLogin);

router.route('/refresh').get(authController.handleRefresh);

router.route('/logout').get(authController.handleLogout);

export default router;
