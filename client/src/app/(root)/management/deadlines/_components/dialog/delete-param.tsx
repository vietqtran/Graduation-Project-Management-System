'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useManagement from '@/hooks/useManagement'
import { ParametersResponse } from '@/types/management.type'

interface DeleteParamDialogProps {
  parameter: ParametersResponse[0]
  onClose: () => void
}

const DeleteParamDialog = ({ parameter, onClose }: DeleteParamDialogProps) => {
  const { deleteParameter } = useManagement()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const response = await deleteParameter({ _id: parameter._id })

    if (response === true) {
      onClose()
    }
    setIsDeleting(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Parameter</DialogTitle>
        </DialogHeader>
        <div className='text-sm text-gray-600'>
          Are you sure you want to delete <strong>{parameter.param_name}</strong>? This action cannot be undone.
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteParamDialog
