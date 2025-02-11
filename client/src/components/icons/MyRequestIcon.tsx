import React from 'react'

const MyRequestIcon = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
    >
      <rect x='4' y='3' width='16' height='18' rx='2' ry='2'></rect>
      <line x1='8' y1='7' x2='16' y2='7'></line>
      <line x1='8' y1='11' x2='16' y2='11'></line>
      <line x1='8' y1='15' x2='13' y2='15'></line>
    </svg>
  )
}

export default MyRequestIcon
