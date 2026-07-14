import mongoose from "mongoose";
import BlogModel from "../models/Blog.js";

// ==========================================
// ROUTE HANDLER: FETCH SINGLE BLOG POST
// ==========================================
const GetSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ success: false, message: 'Invalid Blog Post ID format' });
        }

        const Post = await BlogModel.findById(postId)
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "FullName profile email" 
                }
            });

        if (!Post) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        res.status(200).json({ success: true, Post });
    } catch (error) {
        console.error("Error fetching single blog post:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { GetSinglePost };
