import BlogModel from "../models/Blog.js"; // Fixed typo from Blgomodel to BlogModel
import CommentModel from "../models/Comments.js"; // Standardized file name naming convention

const AddComment = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user._id;

        // 1. Validate required fields explicitly
        if (!postId || !comment?.trim()) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // 2. Check if the blog post exists FIRST to prevent orphaned data
        const blogPost = await BlogModel.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ success: false, message: 'Blog post not found.' });
        }

        // 3. Create and save the new comment safely
        const newComment = new CommentModel({
            postId,
            userId,
            comment: comment.trim()
        });
        await newComment.save();

        // 4. Update the parent blog document array reference
        blogPost.comments.push(newComment._id);
        await blogPost.save();

        // 5. Populate user details if your frontend UI requires displaying names immediately
        // await newComment.populate('userId', 'fullName avatar'); 

        res.status(201).json({ 
            success: true, 
            message: 'Comment added successfully', 
            comment: newComment 
        });
        
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { AddComment };
