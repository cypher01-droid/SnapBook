import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="header">
    <div className="container header-content">
      <Link to="/" className="logo">SnapBook</Link>
      <nav className="nav-links">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="btn-signup">Sign Up</Link>
      </nav>
    </div>
  </header>
);

export default Header;