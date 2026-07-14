import express from 'express';
import { Login, Logout, Register, updateProfile, CheckAuth } from '../controllers/Auth.js';
import { upload } from '../middleware/Multer.js';
import { isLogin } from '../middleware/CheckAdmin.js'; 

const AuthRoutes = express.Router();

// ==========================================
// POST ROUTES
// ==========================================
AuthRoutes.post('/register', upload.single('profile'), Register);
AuthRoutes.post('/login', Login);
AuthRoutes.post('/logout', Logout);

// ==========================================
// GET ROUTES
// ==========================================
AuthRoutes.get('/checkauth', isLogin, CheckAuth);

// ==========================================
// PATCH ROUTES
// ==========================================
AuthRoutes.patch('/profile/:id', isLogin, upload.single('profile'), updateProfile);

export default AuthRoutes;
