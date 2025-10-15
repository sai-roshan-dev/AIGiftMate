import React, { useState } from 'react';
import './index.css';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi'; // Hamburger & close icons

const NavBar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="nav-header">
      <div className="container nav-content">
        <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
          AIGiftMate
        </Link>

        {/* Hamburger toggle visible on medium/below */}
        <button
          className="nav-menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link-button ${isActive ? 'nav-link-button-primary' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/trending-gifts"
                className={({ isActive }) =>
                  `nav-link-button ${isActive ? 'nav-link-button-primary' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                TrendingGifts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link-button ${isActive ? 'nav-link-button-primary' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link-button ${isActive ? 'nav-link-button-primary' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>

            {isLoggedIn ? (
              <li className="nav-button-group">
                <div className="user-menu-trigger">
                  <button className="nav-button nav-button-ghost">
                    {/* User icon SVG placeholder */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: '6px' }}
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {user?.username || 'User'}
                  </button>
                  <div className="user-dropdown-content">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin-dashboard"
                        className="dropdown-item-button"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="dropdown-item-button"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/saved-gifts"
                      className="dropdown-item-button"
                      onClick={() => setMenuOpen(false)}
                    >
                      Saved Gifts
                    </Link>
                    <div className="dropdown-separator"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item-button dropdown-item-button-logout"
                    >
                      {/* Logout icon SVG placeholder */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: '6px' }}
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="17 16 22 12 17 8" />
                        <line x1="22" x2="10" y1="12" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-button-group">
                  <Link
                    to="/login"
                    className="nav-button nav-button-ghost nav-link-button"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="nav-button nav-link-button nav-color"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;