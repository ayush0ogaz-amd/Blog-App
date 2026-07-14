import jwt from 'jsonwebtoken';
import UserModal from '../models/User.js';

// ==========================================
// MIDDLEWARE 1: USER AUTHENTICATION GUARD
// ==========================================
const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Please Login' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModal.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User account no longer exists' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token structure.' });
        }
        
        console.error('Unexpected Auth Middleware Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error during validation' });
    }
};

// ==========================================
// MIDDLEWARE 2: ADMINISTRATOR ROUTE GUARD
// ==========================================
const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Complete authentication verification first' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to administrators only' });
    }

    next();
};

export { isAdmin, isLogin };
