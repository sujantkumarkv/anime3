import React from 'react';
import { FaTwitter } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer style={{
      boxSizing: 'border-box',
      margin: 0,
      padding: '80px',
      fontFamily: 'Bree Serif',
      color: '#fff',
      backgroundColor: 'inherit',
      textAlign: 'center',
    }}>
     
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        </div>
        <p>
          Developer credits:
          <p>
          <a href="https://twitter.com/sujantkumarkv" target={"_blank"} style={{ color: '#fff', textDecoration: 'none' }}>
            <FaTwitter style={{ marginRight: '10px' }} />
            Sujant Kumar Kv
          </a>
          </p>
        </p>
     
      
    </footer>
  );
};


