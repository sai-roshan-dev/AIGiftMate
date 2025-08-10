import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <p className="footer-text">© 2025 AIGiftMate. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/terms" className="footer-link">Terms</Link>
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
