import { Button } from '@/components/ui/button'
import React from 'react'
import { ProjectIdea } from './ReviewIdeas'
import { STATUS_MASTER } from '@/constants/status'

interface IdeaDetailProps {
  idea: ProjectIdea | null
  isOpen: boolean
  onClose: () => void
}

const IdeaDetail: React.FC<IdeaDetailProps> = ({ idea, isOpen, onClose }) => {
  if (!isOpen || !idea) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50' onClick={onClose}>
      <div className='bg-white mt-20 p-8 rounded-lg shadow-lg w-[50vw] h-[80vh] ' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center border-b pb-4 mb-4'>
          <h2 className='text-2xl font-bold'>{idea.name}</h2>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div>
            <p className='text-gray-600'>
              <strong>Field:</strong> {idea.field[0].name}
            </p>
            <p className='text-gray-600'>
              <strong>Major:</strong> {idea.major[0].name}
            </p>
            <p className='text-gray-600'>
              <strong>Description:</strong> {idea.description}
            </p>
          </div>

          <div>
            <p className='text-gray-600'>
              <strong>Campus:</strong> {idea.campus.name}
            </p>
            <p className='text-gray-600'>
              <strong>Created At:</strong> {new Date(idea.created_at).toLocaleDateString()}
            </p>
            <p className='text-gray-600'>
              <strong>Status:</strong>{' '}
              <span
                className={STATUS_MASTER[idea.status] === 'APPROVED' ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}
              >
                {STATUS_MASTER[idea.status]}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetail
