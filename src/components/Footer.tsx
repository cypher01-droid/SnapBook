import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container">
      <p>© {new Date().getFullYear()} SnapBook. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;