import React from 'react';

export default function TraviLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw', transform: 'translateX(-2.5vw)' }}>
      {/* Google Fonts Import for Caveat */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
        .travi-logo-text {
          font-family: 'Caveat', cursive;
          font-weight: 700;
          font-size: clamp(36px, 6.5vw, 95px);
          color: #FF5A5F; /* --marker-red */
          -webkit-text-stroke: 1.5px #1a1a1a;
          text-shadow: 4px 4px 0px #1a1a1a;
          text-transform: none;
        }
      `}</style>
      
      {/* Rotated Blue Aeroplane SVG (Inline Lucide Plane) */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="#4A90E2" /* --marker-blue */
        stroke="#1a1a1a" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ 
          transform: 'rotate(45deg)',
          width: 'clamp(30px, 5.5vw, 75px)',
          height: 'clamp(30px, 5.5vw, 75px)'
        }}
      >
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 2-2.3-.6c-.5-.1-1.1.1-1.3.6l-.2.4c-.2.5-.1 1 .3 1.3L7 17l.8 3.5c.1.5.6.8 1.1.8l.4-.2c.5-.2.7-.8.6-1.3L9.3 17.5l2-2 3.5 5.5c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1Z"/>
      </svg>

      {/* Styled text "Travi!" */}
      <span className="travi-logo-text">Travi!</span>
    </div>
  );
}
