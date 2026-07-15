import React from 'react';
import { Link } from 'react-router-dom';
import useTypewriter from '../hooks/useTypewriter';
import bgImage from '../assets/images/landing-bg.jpg';
import logo from '../assets/images/logo.png';

const texts = [
  'Capture your moments.',
  'Book a pro photographer.',
  'Create lasting memories.',
];

const LandingPage: React.FC = () => {
  const typedText = useTypewriter(texts, 100, 50, 1800);

  return (
    <div className="landing">
      {/* Fullscreen background image */}
      <img
        src={bgImage}
        alt="Background"
        className="bg-image"
      />

      {/* Dark overlay for readability */}
      <div className="overlay" />

      {/* Centered content */}
      <div className="center-content">
        {/* Logo inside a glass circle */}
        <div className="logo-circle">
          <img src={logo} alt="SnapBook" className="logo-img" />
        </div>

        <h1 className="typewriter">
          {typedText}
          <span className="cursor" />
        </h1>

        <p className="tagline">
          Find and book top-rated photographers for any occasion.
        </p>

        <div className="buttons">
          <Link to="/login" className="btn-glass">
            Login
          </Link>
          <Link to="/register" className="btn-glass btn-primary">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <span>© {new Date().getFullYear()} SnapBook. All rights reserved.</span>
        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;