import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaSignOutAlt, FaUser, FaBriefcase, FaMapMarkedAlt, FaGraduationCap, FaHome } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              GC
            </div>
            <span className="text-xl font-bold text-gray-800">GigConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center space-x-1 text-primary font-medium border-b-2 border-primary pb-1" 
                  : "flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-200"
              }
            >
              <FaHome className="text-lg" />
              <span>Home</span>
            </NavLink>
            
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-1 text-primary font-medium border-b-2 border-primary pb-1" 
                      : "flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-200"
                  }
                >
                  <FaUser className="text-lg" />
                  <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                  to="/radar" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-1 text-primary font-medium border-b-2 border-primary pb-1" 
                      : "flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-200"
                  }
                >
                  <FaMapMarkedAlt className="text-lg" />
                  <span>Radar</span>
                </NavLink>
                
                <NavLink 
                  to="/post-job" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-1 text-primary font-medium border-b-2 border-primary pb-1" 
                      : "flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-200"
                  }
                >
                  <FaBriefcase className="text-lg" />
                  <span>Post Job</span>
                </NavLink>
                
                <NavLink 
                  to="/courses" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-1 text-primary font-medium border-b-2 border-primary pb-1" 
                      : "flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-200"
                  }
                >
                  <FaGraduationCap className="text-lg" />
                  <span>Courses</span>
                </NavLink>
                
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors duration-200">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 hidden group-hover:block z-10">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-gray-700 hover:text-primary transition-colors duration-200"
                  }
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center space-x-2 text-primary font-medium" 
                  : "flex items-center space-x-2 text-gray-700"
              }
              onClick={() => setIsOpen(false)}
            >
              <FaHome />
              <span>Home</span>
            </NavLink>
            
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-2 text-primary font-medium" 
                      : "flex items-center space-x-2 text-gray-700"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink 
                  to="/radar" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-2 text-primary font-medium" 
                      : "flex items-center space-x-2 text-gray-700"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaMapMarkedAlt />
                  <span>Radar</span>
                </NavLink>
                <NavLink 
                  to="/post-job" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-2 text-primary font-medium" 
                      : "flex items-center space-x-2 text-gray-700"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaBriefcase />
                  <span>Post a Job</span>
                </NavLink>
                <NavLink 
                  to="/courses" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-2 text-primary font-medium" 
                      : "flex items-center space-x-2 text-gray-700"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaGraduationCap />
                  <span>Courses</span>
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    isActive 
                      ? "flex items-center space-x-2 text-primary font-medium" 
                      : "flex items-center space-x-2 text-gray-700"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser />
                  <span>Profile</span>
                </NavLink>
                <div className="pt-2 border-t border-gray-200">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3">
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    isActive 
                      ? "px-4 py-2 bg-blue-50 text-primary font-medium rounded-md" 
                      : "px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-4 py-2 bg-primary text-white font-medium rounded-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 