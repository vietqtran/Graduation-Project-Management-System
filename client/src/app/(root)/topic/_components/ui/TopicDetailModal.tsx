import React from 'react'
import { Button } from '@/components/ui/button'

interface TopicDetailModalProps {
  isOpen: boolean
  onClose: () => void
  topic: {
    name: string
    description?: string
    created_at: string
    updated_at: string
    status?: string
    due_date?: string
  }
}

export interface Project {
  _id: string
  name: string
  description: string
  majorId?: string
  major: { _id: string; name: string }[]
  field: { _id: string; name: string }[]
  document: string
  campus: { _id: string; name: string } | null
  category: string
}

const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ isOpen, onClose, topic }) => {
  if (!isOpen || !topic) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50' onClick={onClose}>
      <div
        className='bg-white rounded-lg shadow-lg w-[50vw] h-[80vh] overflow-auto p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center border-b pb-4 mb-4'>
          <h2 className='text-3xl font-semibold text-gray-800'>{topic.name}</h2>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
        </div>

        <div className='space-y-6'>
          <p className='text-gray-700'>
            <strong className='font-medium'>Description:</strong> {topic.description || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <strong className='font-medium'>Created At:</strong> {new Date(topic.created_at).toLocaleDateString()}
          </p>
          <p className='text-gray-700'>
            <strong className='font-medium'>Updated At:</strong> {new Date(topic.updated_at).toLocaleDateString()}
          </p>
          <p className='text-gray-700'>
            <strong className='font-medium'>Status:</strong> {topic.status || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <strong className='font-medium'>Due Date:</strong>{' '}
            {topic.due_date ? new Date(topic.due_date).toLocaleDateString() : 'N/A'}
          </p>
          {/* Add other topic details here as necessary */}
        </div>
      </div>
    </div>
  )
}

export default TopicDetailModal
