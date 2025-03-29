'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUpload } from '@/hooks/useUpload'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import instance from '@/utils/axios'
import { Textarea } from '@/components/ui/textarea'

type RequestFormProps = {
  onSubmit: (data: {
    to_user: string
    type: string
    remark: string
    description: string
    document: string
    due_date: string
  }) => void
  onClose: () => void
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      to_user: '',
      type: 'project',
      remark: '',
      description: '',
      document: '',
      due_date: ''
    }
  })

  const { upload } = useUpload()
  const [uploading, setUploading] = useState(false)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [leaders, setLeaders] = useState<{ id: string; email: string }[]>([])

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const response = await instance.get('/project/get-project-leader-for-supervisor', {
          withCredentials: true
        })
        if (Array.isArray(response.data.data)) {
          setLeaders(response.data.data)
        } else {
          console.error('API did not return an array:', response.data)
        }
      } catch (error) {
        console.error('Error fetching leaders:', error)
      }
    }
    fetchLeaders()
  }, [])

  useEffect(() => {
    const subscription = form.watch((formValues) => {
      onSubmit(
        formValues as {
          to_user: string
          type: string
          remark: string
          description: string
          document: string
          due_date: string
        }
      )
    })

    return () => subscription.unsubscribe()
  }, [form, onSubmit])
  async function handleUpload(file: File) {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    try {
      const fileList = {
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
        0: file,
        [Symbol.iterator]: function* () {
          yield this[0]
        }
      } as FileList

      const uploadResponse = await upload(fileList)

      if (!uploadResponse?.success || !uploadResponse.results) {
        throw new Error('Upload failed')
      }

      const fileResult = uploadResponse.results[0]
      if (!fileResult) {
        throw new Error('Invalid upload response')
      }

      setDocumentId(fileResult.key)
      form.setValue('document', fileResult.key)
      toast.success('File uploaded successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Định nghĩa hàm handleFormSubmit để xử lý khi form được submit

  return (
    <div>
      <div className='bg-white grid p-1 gap-4'>
        <h2 className='text-2xl font-bold text-center mt-12'>Submit a Request</h2>
        <Form {...form}>
          <form className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='to_user'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To User (Leader)</FormLabel>
                  <FormControl>
                    <select {...field} className='border rounded p-2 w-full text-black bg-white'>
                      <option value=''>Select a leader</option>
                      {Array.isArray(leaders) && leaders.length > 0 ? (
                        leaders.map((leader) => (
                          <option key={leader.id} value={leader.id}>
                            {leader.email}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading leaders...</option>
                      )}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='remark'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Enter remark' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Enter description' {...field} className='h-24' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='from_user'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From User</FormLabel>
                  <FormControl>
                    <Input disabled type='text' placeholder='Enter sender ID' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='document'
              render={() => (
                <FormItem>
                  <FormLabel>Upload Document</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(file)
                      }}
                      disabled={uploading}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    onClick={() => documentId && toast.success('Document already uploaded!')}
                    disabled={uploading || !!documentId}
                    className='mt-2'
                  >
                    {uploading ? 'Uploading...' : documentId ? 'Uploaded' : 'Upload'}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='due_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type='datetime-local' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default RequestForm
