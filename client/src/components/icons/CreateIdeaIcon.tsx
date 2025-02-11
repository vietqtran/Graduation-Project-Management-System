import React from 'react';

const CreateIdeaIcon = ({ size = 32, strokeWidth = 2 }) => {
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
        transform="translate(-3, 0)" // Dịch sang trái 2px
      >
        <path d="M9 18h6m-3 3v-3m-4-6a5 5 0 1 1 10 0c0 2.5-2 4-2 4h-6s-2-1.5-2-4z" />
        <path d="M19 2v4m-2-2h4" />
      </svg>
    );
  };

export default CreateIdeaIcon;