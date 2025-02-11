import React from 'react';

const TeamIcon = ({ size = 32, strokeWidth = 2 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Icon hình người thứ nhất (chính giữa) */}
      <circle cx="12" cy="8" r="3" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />

      {/* Icon hình người bên trái */}
      <circle cx="5" cy="10" r="2.5" />
      <path d="M2 21v-2a3.5 3.5 0 0 1 3.5-3.5h3" />

      {/* Icon hình người bên phải */}
      <circle cx="19" cy="10" r="2.5" />
      <path d="M22 21v-2a3.5 3.5 0 0 0-3.5-3.5h-3" />
    </svg>
  );
};

export default TeamIcon;
