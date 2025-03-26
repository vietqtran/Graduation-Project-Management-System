'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type React from 'react'
import { Upload } from 'lucide-react'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import { useState } from 'react'
import { useUpload } from '@/hooks/useUpload'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (urls: string[]) => void
  requestId: string
}

export function UploadModal({ isOpen, onClose, onSubmit, requestId }: UploadModalProps) {
  const [files, setFiles] = useState<FileList | null>(null)
  const { upload } = useUpload()
  const { user } = useAppSelector((state) => state.auth)

  async function handleSubmit() {
    const uploadResponse = await upload(files)
    if (!uploadResponse?.success || !uploadResponse.results) {
      throw new Error('File upload failed')
    }
    let fileData = null
    if (files) {
      const fileResult = uploadResponse.results[0]
      if (!fileResult) {
        throw new Error('File upload result is undefined')
      }
      fileData = {
        file_url: fileResult.key ?? '',
        file_type: files[0].type,
        file_size: files[0].size,
        original_name: fileResult.originalName,
        key: fileResult.key
      }
    }
    const documentData = {
      title: 'Request Document - ' + requestId,
      description: 'Document for request ' + requestId,
      project_id: user?.project,
      user: user?._id,
      ...(fileData && {
        file_url: fileData.file_url,
        file_type: fileData.file_type,
        file_size: fileData.file_size,
        original_name: fileData.original_name,
        key: fileData.key
      })
    }

    const { data: uploadedDocument } = await instance.post('/documents', documentData, {
      withCredentials: true
    })
    onSubmit([uploadedDocument.data._id])
    toast.success('Document uploaded successfully')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Upload documents</DialogTitle>
          <DialogDescription>Upload your documents here</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='documents' className='text-right'>
              Documents
            </Label>
            <div className='col-span-3'>
              <div className='flex items-center gap-2'>
                <Input
                  id='documents'
                  type='file'
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className='col-span-3'
                />
                <Button type='button' size='icon' variant='outline'>
                  <Upload className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='button' onClick={handleSubmit}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
