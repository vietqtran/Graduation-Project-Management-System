import React from 'react';

const ListIdeaOfSupervisorIcon = ({ size = 32, strokeWidth = 2 }) => {
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
       transform="translate(-4, 0)"
    >
      {/* Hình bóng đèn */}
      <path d="M9 18h6m-3 3v-3m-4-6a5 5 0 1 1 10 0c0 2.5-2 4-2 4h-6s-2-1.5-2-4z" />
      
      {/* Ánh sáng nhỏ phía trên */}
      <path d="M12 2v2" />
    </svg>
  );
};

export default ListIdeaOfSupervisorIcon;