import BlogModel from "../models/Blog.js"; // Fixed spelling typo from Blgomodel to BlogModel
import { v2 as cloudinary } from 'cloudinary';

const Create = async (req, res) => {
    try {
        const { title, desc } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        // Save the secure cloud web URL into your database string field
        const imageUrl = req.file.path; 

        const CreateBlog = new BlogModel({
            title,
            desc,
            image: imageUrl
        });

        await CreateBlog.save();

        res.status(201).json({
            success: true,
            message: 'Blog Created Successfully',
            blog: CreateBlog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const update = async (req, res) => {
    try {
        const { title, desc } = req.body;
        const blogId = req.params.id;

        const blogToUpdate = await BlogModel.findById(blogId);
        if (!blogToUpdate) {
            // Cloud cleanup: If a new image was uploaded to cloud but blog didn't exist, delete it
            if (req.file && req.file.filename) {
                await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
            }
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        if (title) blogToUpdate.title = title;
        if (desc) blogToUpdate.desc = desc;

        // If a new image is provided, delete the old cloud asset and attach the new URL
        if (req.file) {
            if (blogToUpdate.image) {
                // Extracts the Cloudinary Public ID out of your stored URL string to trigger cloud deletion
                const publicId = blogToUpdate.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId).catch(err => 
                    console.error('Cloudinary asset removal failure during update:', err.message)
                );
            }
            blogToUpdate.image = req.file.path; // Update database property to fresh secure URL
        }

        await blogToUpdate.save();
        res.status(200).json({ success: true, message: 'Blog updated successfully', blog: blogToUpdate });
    } catch (error) {
        console.error("Error updating blog:", error);
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const GetPosts = async (req, res) => {
    try {
        const posts = await BlogModel.find();
       
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: 'No blogs found' });
        }
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const DeleteBlog = async (req, res) => {
    try {
        const postid = req.params.id;
        const post = await BlogModel.findById(postid);
       
        if (!post) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        // Safely erase the hosting asset out of Cloudinary cloud network
        if (post.image) {
            const publicId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId).catch(err => 
                console.error('Cloudinary asset removal failure during deletion:', err.message)
            );
        }

        const deletepost = await BlogModel.findByIdAndDelete(postid);
        res.status(200).json({ success: true, message: "Post Deleted Successfully", post: deletepost });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { Create, update, GetPosts, DeleteBlog };
