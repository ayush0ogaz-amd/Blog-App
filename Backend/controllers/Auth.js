import fs from 'fs'; 
import path from 'path'; 
import jwt from 'jsonwebtoken'; 
import { v2 as cloudinary } from 'cloudinary'; 
import { FileUploadeToColoudinary } from '../libs/Cloudinary.js'; 
import UserModal from '../models/User.js'; 
import bcrypt from 'bcryptjs'; 

const UPLOAD_DIR = 'public/images';

// ==========================================
// ROUTE HANDLER 1: USER REGISTRATION
// ==========================================
const Register = async (req, res) => {
    let localFilePath = null;
    
    try {
        const { FullName, email, password } = req.body;

        const existUser = await UserModal.findOne({ email });
        if (existUser) {
            if (req.file) {
                await fs.promises.unlink(path.join(UPLOAD_DIR, req.file.filename)).catch(() => {});
            }
            return res.status(400).json({ success: false, message: "User already exists. Please login." });
        }

        let profileUrl = null;

        if (req.file) {
            localFilePath = path.join(UPLOAD_DIR, req.file.filename);
            const cloudinaryResult = await FileUploadeToColoudinary(localFilePath, 'user_profiles');
            profileUrl = cloudinaryResult.secure_url;

            await fs.promises.unlink(localFilePath).catch(err => 
                console.error('Temporary file deletion error:', err.message)
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new UserModal({
            FullName,
            email,
            password: hashedPassword, 
            profile: profileUrl, 
        });

        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ success: true, message: 'User registered successfully', user: userResponse });
    } catch (error) {
        console.error('Error during registration:', error);
        if (localFilePath) {
            await fs.promises.unlink(localFilePath).catch(() => {});
        }
        res.status(500).json({ success: false, error: 'Error during registration' });
    }
};

// ==========================================
// ROUTE HANDLER 2: USER AUTHENTICATION (LOGIN)
// ==========================================
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        
        const FindUser = await UserModal.findOne({ email });
        if (!FindUser) {
            return res.status(404).json({ success: false, message: "Account not found. Please register." });
        }
        
        const comparePassword = await bcrypt.compare(password, FindUser.password);
        if (!comparePassword) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ userId: FindUser._id }, process.env.JWT_SECRET);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3 * 24 * 60 * 60 * 1000 
        });
        
        const userResponse = FindUser.toObject();
        delete userResponse.password;

        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            user: userResponse 
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// ROUTE HANDLER 3: USER LOGOUT
// ==========================================
const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// ROUTE HANDLER 4: CHECK AUTH / PERSIST USER
// ==========================================
const CheckAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, authenticated: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModal.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, authenticated: false, message: "User not found" });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({ 
            success: true, 
            authenticated: true, 
            user: userResponse 
        });
    } catch (error) {
        console.error('Error during auth validation:', error);
        return res.status(401).json({ success: false, authenticated: false, message: "Invalid or expired token" });
    }
};

// ==========================================
// ROUTE HANDLER 5: UPDATE USER PROFILE
// ==========================================
const updateProfile = async (req, res) => {
    let localFilePath = null;
    try {
        const userId = req.params.id;
        const { FullName, password } = req.body;

        const user = await UserModal.findById(userId);
        if (!user) {
            if (req.file) {
                await fs.promises.unlink(path.join(UPLOAD_DIR, req.file.filename)).catch(() => {});
            }
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (FullName) user.FullName = FullName;
        
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            localFilePath = path.join(UPLOAD_DIR, req.file.filename);
            
            if (user.profile) {
                const publicId = user.profile.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`user_profiles/${publicId}`).catch(err => 
                    console.error('Old Cloudinary profile deletion failed:', err.message)
                );
            }

            const cloudinaryResult = await FileUploadeToColoudinary(localFilePath, 'user_profiles');
            user.profile = cloudinaryResult.secure_url;

            await fs.promises.unlink(localFilePath).catch(err => 
                console.error('Temporary profile file deletion error:', err.message)
            );
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: userResponse
        });
    } catch (error) {
        console.error('Error during profile update:', error);
        if (localFilePath) {
            await fs.promises.unlink(localFilePath).catch(() => {});
        }
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { Register, Login, Logout, CheckAuth, updateProfile };
