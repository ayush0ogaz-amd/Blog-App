import express from 'express'
import { GetSinglePost } from '../controllers/Public.js'

const PublicRoutes = express.Router()

// ==========================================
// GET ROUTES
// ==========================================
PublicRoutes.get('/Singlepost/:id', GetSinglePost)

export default PublicRoutes
