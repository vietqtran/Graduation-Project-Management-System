'use client'

import React from 'react'

interface Member {
  _id: string
  display_name: string
  username: string
  email: string
  totalTask: number
  taskNotDone: number
  taskDoing: number
  taskDone: number
  progress: string
  role: string
}


interface MemberProfileModalProps {
  member: Member
  onClose: () => void
}

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-300'>
        <h2 className='text-xl font-bold mb-2'>Member profile of: {member.username}</h2>
        <p>
          <strong>Role:</strong>  {member.role}
        </p>
        <p>
          <strong>Progress:</strong>  {member.progress} 
        </p>
        <p>
          <strong>Tasks Completed:</strong>  {member.taskDone}
        </p>
        <p>
          <strong>Tasks Not Completed:</strong>  {member.taskNotDone}
        </p>
        <p>
          <strong>Tasks Doing:</strong>  {member.taskDoing}
        </p>
        <p>
          <strong>Total task:</strong>  {member.totalTask}
        </p>
        <button className='mt-4 px-4 py-2 bg-gray-300 rounded' onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default MemberProfileModal
