import React from 'react';

export const PeekingMascot = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base Cilok Body */}
    <circle cx="100" cy="110" r="80" fill="#FDE2C3" stroke="#A67B5B" strokeWidth="8"/>
    
    {/* Sauce Droplets (Bumbu Kacang / Saus) on top */}
    <path d="M 28 80 C 40 40 70 30 100 30 C 130 30 160 40 172 80 C 175 90 165 95 155 90 C 145 85 140 70 130 70 C 120 70 110 90 100 90 C 90 90 80 70 70 70 C 60 70 55 85 45 90 C 35 95 25 90 28 80 Z" fill="#B36A3C" stroke="#A67B5B" strokeWidth="6" strokeLinejoin="round"/>
    <path d="M 33 80 C 43 45 70 36 100 36 C 130 36 157 45 167 80 C 170 85 162 90 155 85 C 143 78 138 75 130 75 C 120 75 110 85 100 85 C 90 85 80 75 70 75 C 62 75 57 78 45 85 C 38 90 30 85 33 80 Z" fill="#CD7F32"/>
    
    {/* Nut bits on the sauce */}
    <circle cx="80" cy="50" r="3" fill="#FFE4B5" />
    <circle cx="120" cy="55" r="4" fill="#FFE4B5" />
    <circle cx="100" cy="45" r="3" fill="#FFE4B5" />
    <circle cx="60" cy="65" r="3" fill="#FFE4B5" />
    <circle cx="145" cy="65" r="3.5" fill="#FFE4B5" />
    
    {/* Eyes (Looking left/front) */}
    <circle cx="130" cy="110" r="10" fill="#3E2723"/>
    <circle cx="133" cy="106" r="3" fill="#FFFFFF"/>
    <circle cx="165" cy="110" r="10" fill="#3E2723"/>
    <circle cx="168" cy="106" r="3" fill="#FFFFFF"/>
    
    {/* Blush / Cheeks */}
    <ellipse cx="115" cy="122" rx="8" ry="4" fill="#FF8A80" opacity="0.8"/>
    <ellipse cx="180" cy="122" rx="8" ry="4" fill="#FF8A80" opacity="0.8"/>
    
    {/* Mouth */}
    <path d="M 140 120 Q 147.5 132 155 120" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" fill="none"/>
    
    {/* Hand making finger heart (Saranghae) */}
    <circle cx="185" cy="155" r="14" fill="#FDE2C3" stroke="#A67B5B" strokeWidth="6"/>
    <path d="M 178 150 C 178 145 188 145 188 150 L 182 160" stroke="#A67B5B" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <path d="M 188 150 C 188 145 198 145 198 150 L 190 158" stroke="#A67B5B" strokeWidth="4" strokeLinecap="round" fill="none"/>

    {/* Small floating heart */}
    <path d="M 195 125 C 195 115 210 115 210 125 C 210 135 195 145 195 145 C 195 145 180 135 180 125 C 180 115 195 115 195 125 Z" fill="#FF1744" stroke="#A67B5B" strokeWidth="4" strokeLinejoin="round"/>
  </svg>
);
