import React from 'react';

const ListSupervisorIcon = ({ size = 32, strokeWidth = 2 }) => {
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
      {/* Danh sách - List */}
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <line x1="6" y1="8" x2="12" y2="8" />
      <line x1="6" y1="12" x2="12" y2="12" />
      <line x1="6" y1="16" x2="12" y2="16" />

      {/* Supervisor - Người giám sát */}
      <circle cx="18" cy="8" r="3" />
      <path d="M16 20v-1.5a3 3 0 0 1 6 0V20" />
    </svg>
  );
};

export default ListSupervisorIcon;