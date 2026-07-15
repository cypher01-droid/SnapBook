import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => (
  <section className="hero">
    <div className="container">
      <h1 className="hero-title">Book the Perfect Photographer</h1>
      <p className="hero-subtitle">
        From weddings to portraits, find and reserve top photographers instantly.
      </p>
      <Link to="/photographers" className="btn-hero">
        Browse Photographers
      </Link>
    </div>
  </section>
);

export default HeroSection;