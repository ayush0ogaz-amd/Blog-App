import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { BaseUrl, delet, get } from '../services/Endpoint';
import toast from 'react-hot-toast';

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loadedata, setLoadedata] = useState(false);

  // Handle post deletion pipeline
  const handleDelete = async (postId) => {
    // Fixed: Prompt string matches target object action
    const confirmed = window.confirm('Are you sure you want to delete this post?');
  
    if (confirmed) {
      try {
        const response = await delet(`/blog/delete/${postId}`);
        const data = response.data;

        if (data.success) {
          toast.success(data.message);
          setLoadedata(!loadedata); 
        } else {
          toast.error('Failed to delete the post.');
        }
      } catch (error) {
        console.error('Error deleting post:', error);

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  // Placeholder handler function for post updates
  const handleUpdate = (postId) => {
    console.log(`Post with ID ${postId} updated.`);
  };

  // Synchronize component layout with backend database feeds
  useEffect(() => {
    const getposts = async () => {
      try {
        const response = await get("/blog/GetPosts");
        const data = response.data;
        setPosts(data.posts);
      } catch (error) {
        console.error("Error loading administration posts feed:", error);
      }
    };
    getposts();
  }, [loadedata]);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 text-white">All Posts</h1>
      <div className="row">
        {posts && posts.map((post) => (
          // Fixed: Changed key path destination pointer from id to _id
          <div className="col-md-4 mb-4" key={post._id}>
            <div className="card h-100 shadow-sm">
              {/* Fixed: Swapped out local static paths for Cloudinary URL delivery directly */}
              <img src={post.image} className="card-img-top" alt={post.title} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                {/* Fixed: Replaced post.description with post.desc matching your database schema */}
                <p className="card-text text-muted">{post.desc}</p>
              </div>
              <div className="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                <button
                  className="btn btn-danger d-flex align-items-center gap-2"
                  onClick={() => handleDelete(post._id)}
                >
                  <FaTrashAlt /> Delete
                </button>
                <button
                  className="btn btn-warning d-flex align-items-center gap-2"
                  onClick={() => handleUpdate(post._id)}
                >
                  <FaEdit /> Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
