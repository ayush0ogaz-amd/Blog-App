import express from 'express'
import { AddComment } from '../controllers/Comments.js'
import { isLogin } from '../middleware/CheckAdmin.js'

const CommentRoutes = express.Router()

// ==========================================
// POST ROUTES
// ==========================================
CommentRoutes.post('/addcomment', isLogin, AddComment)

export default CommentRoutes
