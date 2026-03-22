import React from 'react';

export function Logo({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#1A1A2E" stroke="#E85D04" strokeWidth="2" />
      
      {/* Decorative arc top-right */}
      <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#E85D04" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      
      {/* Pen Body Group */}
      <g transform="translate(0, 0)">
        {/* Pen button/cap */}
        <rect x="46" y="20" width="8" height="6" rx="2" fill="#000000" />
        
        {/* Pen barrel */}
        <rect x="42" y="25" width="16" height="35" rx="3" fill="#E85D04" />
        
        {/* Clip strip */}
        <rect x="58" y="28" width="4" height="15" rx="2" fill="#FF8C42" />
        
        {/* Grip band */}
        <rect x="42" y="52" width="16" height="8" fill="#CC4C00" />
        
        {/* Nib */}
        <polygon points="42,60 58,60 50,75" fill="#FFB380" />
        
        {/* Nib center line */}
        <line x1="50" y1="60" x2="50" y2="72" stroke="#1A1A2E" strokeWidth="1.5" />
        
        {/* Ink dot */}
        <circle cx="50" cy="80" r="2.5" fill="#E85D04" />
      </g>
    </svg>
  );
}
