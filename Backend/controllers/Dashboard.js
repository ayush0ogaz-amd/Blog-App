import BlogModel from "../models/Blog.js";
import CommentModel from "../models/Comments.js";
import UserModal from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';

// ==========================================
// ROUTE HANDLER 1: GET DASHBOARD STATS
// ==========================================
const Dashboard = async (req, res) => {
    try {
        const [userCount, postCount, commentCount] = await Promise.all([
            UserModal.countDocuments(),
            BlogModel.countDocuments(),
            CommentModel.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            counts: {
                users: userCount,
                posts: postCount,
                comments: commentCount
            }
        });
    } catch (error) {
        console.error("Dashboard calculation error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// ROUTE HANDLER 2: GET ALL USERS LIST
// ==========================================
const GetUsers = async (req, res) => {
    try {
        const Users = await UserModal.find().select('-password');
        
        if (Users.length === 0) {
            return res.status(404).json({ success: false, message: "No Users Found" });
        }
        res.status(200).json({ success: true, Users });
    } catch (error) {
        console.error("GetUsers error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// ROUTE HANDLER 3: DELETE USER ACCOUNT
// ==========================================
const Delete = async (req, res) => {
    try {
        const userId = req.params.id;

        const ExistUser = await UserModal.findById(userId);
        if (!ExistUser) {
            return res.status(404).json({ success: false, message: "No User Found" });
        }
        
        if (ExistUser.role === 'admin') {
            return res.status(403).json({ success: false, message: "Sorry, you are an Admin. You cannot delete your account." });
        }

        if (ExistUser.profile) {
            const publicId = ExistUser.profile.split('/').pop().split('.');
            await cloudinary.uploader.destroy(publicId).catch(err => 
                console.error('Cloudinary user profile removal failure:', err.message)
            );
        }

        const DeleteUser = await UserModal.findByIdAndDelete(userId).select('-password');
        res.status(200).json({ success: true, message: "User Deleted Successfully", User: DeleteUser });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" }); 
    }
};

export { Dashboard, GetUsers, Delete };
