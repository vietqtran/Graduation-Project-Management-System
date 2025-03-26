'use client'

import React from 'react'

interface Member {
  _id: number
  username: string
  roles: Array<string>
  progress: number
  tasksCompleted: number
  status: string
}

interface MemberProfileModalProps {
  member: Member
  onClose: () => void
}

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
        <h2 className='text-xl font-bold mb-2'>{member.username}s Profile</h2>
        <p>
          <strong>Role:</strong> {member.roles[0]}
        </p>
        <p>
          <strong>Progress:</strong> {member.progress}%
        </p>
        <p>
          <strong>Tasks Completed:</strong> {member.tasksCompleted}
        </p>
        <p>
          <strong>Status:</strong> {member.status}
        </p>
        <button className='mt-4 px-4 py-2 bg-gray-300 rounded' onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default MemberProfileModal
