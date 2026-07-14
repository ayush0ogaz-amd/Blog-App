import express from 'express'
import { isAdmin, isLogin } from '../middleware/CheckAdmin.js'
import { Dashboard, Delete, GetUsers } from '../controllers/Dashboard.js'

const DashboardRoutes = express.Router()

// ==========================================
// GET ROUTES
// ==========================================
DashboardRoutes.get('/', isLogin, isAdmin, Dashboard)
DashboardRoutes.get('/users', isLogin, isAdmin, GetUsers)

// ==========================================
// DELETE ROUTES
// ==========================================
DashboardRoutes.delete("/delete/:id", isLogin, isAdmin, Delete)

export default DashboardRoutes
