import express from 'express';
import { Create, DeleteBlog, GetPosts, update } from '../controllers/Blog.js';
import { upload } from '../middleware/Multer.js';
import { isLogin, isAdmin } from '../middleware/CheckAdmin.js'; 

const BlogRoutes = express.Router();

// ==========================================
// GET ROUTES
// ==========================================
BlogRoutes.get('/GetPosts', GetPosts);

// ==========================================
// POST ROUTES
// ==========================================
BlogRoutes.post('/create', isLogin, isAdmin, upload.single('postimg'), Create);

// ==========================================
// PATCH ROUTES
// ==========================================
BlogRoutes.patch('/update/:id', isLogin, isAdmin, upload.single('postimg'), update);

// ==========================================
// DELETE ROUTES
// ==========================================
BlogRoutes.delete('/delete/:id', isLogin, isAdmin, DeleteBlog);

export default BlogRoutes;
