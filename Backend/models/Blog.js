import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const BlogModel = mongoose.model('Blog', blogSchema);
export default BlogModel;
