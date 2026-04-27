import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏨 StudentHostel
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          {user ? (
            <>
              {user.role === 'student' && (
                <Link to="/student-dashboard" className="nav-link">
                  My Bookings
                </Link>
              )}
              {user.role === 'owner' && (
                <Link to="/owner-dashboard" className="nav-link">
                  Manage Hostels
                </Link>
              )}
              <div className="nav-user">
                <span>{user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link btn-signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
