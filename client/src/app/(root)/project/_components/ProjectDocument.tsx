import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Button } from '@/components/ui/button'
import { FiEye } from 'react-icons/fi'
import { FileIcon } from 'lucide-react'
import React from 'react'
import { UploadDocument } from '@/types/document.type'
import { format } from 'date-fns'

interface DocumentsTableProps {
  documents: UploadDocument[]
  isLoading: boolean
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function DocumentsTable({ documents, isLoading }: DocumentsTableProps) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <FileIcon className='h-16 w-16 text-gray-400 mb-4' />
        <h3 className='text-lg font-medium text-gray-900'>No documents found</h3>
        <p className='text-sm text-gray-500'>Get started by uploading your first document.</p>
      </div>
    )
  }

  return (
    <div className='rounded-md border m-5'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='py-3 whitespace-nowrap'>Title</TableHead>
            <TableHead className='py-3 whitespace-nowrap'>Description</TableHead>
            <TableHead className='py-3 whitespace-nowrap'>Uploaded By</TableHead>
            <TableHead className='py-3 whitespace-nowrap'>File Size</TableHead>
            <TableHead className='py-3 whitespace-nowrap'>Created At</TableHead>
            <TableHead className='py-3 whitespace-nowrap'>Updated At</TableHead>
            <TableHead className='py-3 whitespace-nowrap'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc._id}>
              <TableCell className='font-medium max-w-[300px] truncate'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='size-full truncate'>
                        <span>{doc.title}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-[300px]' side='top'>
                      <p>{doc.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className='max-w-[300px] truncate'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='size-full truncate'>
                        <span>{doc.description}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-[300px]' side='top'>
                      <p>{doc.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage src={doc.user.avatar} />
                    <AvatarFallback>{doc.user?.display_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className='whitespace-nowrap'>{doc.user?.display_name}</span>
                </div>
              </TableCell>
              <TableCell className='whitespace-nowrap'>{formatFileSize(doc.file_size)}</TableCell>
              <TableCell>{format(new Date(doc.created_at), 'PPp')}</TableCell>
              <TableCell>{format(new Date(doc.updated_at), 'PPp')}</TableCell>
              <TableCell>
                <Button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_S3_BUCKET_PREFIX}${doc.file_url}`, '_blank')}
                  className='bg-green-500 hover:bg-green-600'
                >
                  <FiEye />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
