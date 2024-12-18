import React from 'react';

const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#333333', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Outer Circle */}
      <circle cx="150" cy="150" r="140" fill="url(#brandGradient)" />
      
      {/* White Inner Circle */}
      <circle cx="150" cy="150" r="130" fill="none" stroke="white" strokeWidth="3" />
      
      {/* Enlarged Inner Connection Symbol */}
      <path d="M80,100 Q150,200 220,100 M80,200 Q150,100 220,200" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round" />
      
      {/* Text with original styling */}
      <text x="150" y="250" textAnchor="middle" fontFamily="Garamond, Baskerville, serif" fontSize="35" fontWeight="bold" fill="white">
        <tspan fontSize="45" fontWeight="900">E</tspan>lite
      </text>
    </svg>
  );
}

export default Logo;
