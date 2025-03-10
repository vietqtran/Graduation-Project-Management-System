'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-lg font-bold mb-4'>Confirm Delete</h2>
        <p>Are you sure you want to delete this topic? This action cannot be undone.</p>
        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={onConfirm} variant='default'>
            Delete
          </Button>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
