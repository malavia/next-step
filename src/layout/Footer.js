import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '20px', backgroundColor: '#f8f9fa', borderTop: '1px solid #e1e1e1', textAlign: 'center' }}>
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} Mon Application. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;