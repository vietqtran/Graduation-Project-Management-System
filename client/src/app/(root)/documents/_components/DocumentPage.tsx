'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi'
import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { RootState } from '@/types/store.type'
import { Textarea } from '@/components/ui/textarea'
import { UploadDocument } from '@/types/document.type'
import { format } from 'date-fns'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import { useUpload } from '@/hooks/useUpload'

export default function DocumentManager() {
  const { user } = useAppSelector((state: RootState) => state.auth)
  const [documents, setDocuments] = useState<UploadDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [editingDoc, setEditingDoc] = useState<UploadDocument | null>(null)
  const { upload } = useUpload()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (user?.project) {
      fetchDocuments()
    }
  }, [user?.project, page])

  async function fetchDocuments() {
    try {
      const { data } = await instance.get(`/documents/project/${user?.project}`, {
        params: { page, limit },
        withCredentials: true
      })
      setDocuments(data.data.documents)
      setTotal(data.data.total)
    } catch (error) {
      toast.error('Error fetching documents')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user?.project) {
      toast.error('You are not assigned to any project!')
      return
    }
    setLoading(true)

    try {
      if (!files && !editingDoc) {
        throw new Error('Please select a file')
      }

      let fileData = null
      if (files) {
        const uploadResponse = await upload(files)
        if (!uploadResponse?.success || !uploadResponse.results) {
          throw new Error('File upload failed')
        }

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
        title,
        description,
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

      if (editingDoc) {
        await instance.put(`/documents/${editingDoc._id}`, documentData, {
          withCredentials: true
        })
        toast.success('Document updated successfully')
      } else {
        await instance.post('/documents', documentData, {
          withCredentials: true
        })
        toast.success('Document uploaded successfully')
      }

      resetForm()
      fetchDocuments()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error processing document')
      } else {
        toast.error('Error processing document')
      }
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setTitle('')
    setDescription('')
    setFiles(null)
    setEditingDoc(null)
  }

  async function handleDelete(id: string) {
    try {
      await instance.delete(`/documents/${id}`, { withCredentials: true })
      toast.success('Document deleted successfully')
      fetchDocuments()
    } catch (error) {
      toast.error('Error deleting document')
      console.error('Error:', error)
    }
  }

  function handleEdit(doc: UploadDocument) {
    setEditingDoc(doc)
    setTitle(doc.title)
    setDescription(doc.description || '')
  }

  async function handleView(doc: UploadDocument) {
    try {
      if (doc.file_url) {
        window.open(`${process.env.NEXT_PUBLIC_S3_BUCKET_PREFIX}${doc.file_url}`, '_blank')
      } else {
        toast.error('File URL not available')
      }
    } catch (error) {
      toast.error('Error viewing document')
      console.error('Error:', error)
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-8'>Document Management</h1>

      {/* Upload/Edit Form */}
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md mb-8'>
        <h2 className='text-xl font-semibold mb-4'>{editingDoc ? 'Edit Document' : 'Upload New Document'}</h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Title</label>
            <Input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              rows={3}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>File</label>
            <input
              type='file'
              onChange={(e) => setFiles(e.target.files)}
              className='mt-1 block w-full'
              accept='.pdf,.doc,.docx'
            />
          </div>
          <div className='flex justify-end space-x-3'>
            {editingDoc && (
              <button
                type='button'
                onClick={resetForm}
                className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
            )}
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {loading ? 'Processing...' : editingDoc ? 'Update Document' : 'Upload Document'}
            </button>
          </div>
        </div>
      </form>

      {/* Documents List */}
      <div className='bg-white rounded-lg shadow-md'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Document
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Uploaded By
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{doc.title}</span>
                      <span className='text-sm text-gray-500'>{doc.description}</span>
                      <span className='text-xs text-gray-400'>{doc.file_type}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500'>
                    <div className='size-full flex gap-2 items-center justify-start'>
                      <Avatar className='border size-8'>
                        <AvatarImage src={doc.user.avatar} alt={doc.user.username} />
                        <AvatarFallback>{doc.user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{doc.user?.display_name || doc.user?.username || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{format(new Date(doc.created_at), 'PPp')}</td>
                  <td className='px-6 py-4 text-sm font-medium'>
                    <div className='flex space-x-3'>
                      <button onClick={() => handleView(doc)} className='text-indigo-600 hover:text-indigo-900'>
                        <FiEye className='w-5 h-5' />
                      </button>
                      <button onClick={() => handleEdit(doc)} className='text-yellow-600 hover:text-yellow-900'>
                        <FiEdit2 className='w-5 h-5' />
                      </button>
                      <button onClick={() => handleDelete(doc._id)} className='text-red-600 hover:text-red-900'>
                        <FiTrash2 className='w-5 h-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className='px-6 py-4 text-center text-gray-500'>
                    No documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className='px-6 py-3 flex justify-between items-center border-t border-gray-200'>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className='px-3 py-1 border rounded-md disabled:opacity-50'
            >
              Previous
            </button>
            <span className='text-sm text-gray-700'>
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className='px-3 py-1 border rounded-md disabled:opacity-50'
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
