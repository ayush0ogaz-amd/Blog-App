import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/Endpoint';
import { removeUser } from '../redux/AuthSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Terminate session token pipeline
  const handleLogout = async () => {
    try {
      const request = await post("/auth/logout");
      const response = request.data;
      
      if (request.status === 200) {
        navigate('/login');
        dispatch(removeUser());
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Session termination error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar d-flex justify-content-between align-items-center p-3">
      {/* Brand Identity Branding Link */}
      <Link to={'/'} className="text-decoration-none">
        <h1 className="mx-5 text-white fs-2 fw-bold">CodeByZahid</h1>
      </Link>

      <div className="d-flex align-items-center">
        {/* Conditional Auth Rendering Structure */}
        {!user ? (
          <Link to={'/login'}>
            <button className="btn_sign mx-3">Sign in</button>
          </Link>
        ) : (
          <div className="dropdown mx-5">
            <div 
              className="avatar-container pointer rounded-circle overflow-hidden bg-secondary" 
              data-bs-toggle="dropdown" 
              aria-expanded="false" 
              style={{ width: '40px', height: '40px', cursor: "pointer" }}
            >
              {/* Fixed: Parses secure Cloudinary URL directly with a default profile image fallback */}
              <img 
                className="img-fluid h-100 w-100" 
                src={user.profile || 'https://unsplash.com'}
                alt="User Menu Profile Avatar"
                style={{ objectFit: "cover" }}
              />
            </div>
            
            {/* Action Item Menu Options Overlay */}
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              <li className="dropdown-header border-bottom border-secondary pb-2 mb-1">
                <span className="fw-bold text-white d-block">{user.FullName}</span>
                <small className="text-muted">{user.email}</small>
              </li>
              {user.role === 'admin' && (
                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
              )}
              <li><Link className="dropdown-item" to={`/profile/${user._id}`}>Profile</Link></li>
              <li><hr className="dropdown-divider border-secondary" /></li>
              <li>
                <button 
                  className="dropdown-item text-danger border-0 bg-transparent w-100 text-start" 
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
