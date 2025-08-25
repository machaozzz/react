import React from 'react'

export default function Logo(){
  return (
    <svg width="140" height="28" viewBox="0 0 280 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="56" rx="8" fill="url(#g)" />
      <text x="28" y="36" fill="#fff" fontWeight="800" fontSize="24">STAND</text>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6a00"/>
          <stop offset="1" stopColor="#ff3b30"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
