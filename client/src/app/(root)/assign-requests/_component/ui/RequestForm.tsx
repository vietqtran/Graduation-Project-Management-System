'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks'
import instance from '@/utils/axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
interface Project {
  _id: string
  leader: string
  name: string // Thêm các field khác nếu có
}

type RequestFormProps = {
  onSubmit: (data: {
    to_user: string
    type: string
    remark: string
    description: string
    document: string
    due_date: string
    selectedProjectId?: string
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

  const { me } = useAuth()
  interface User {
    id: string
    name: string
    email: string
  }

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await me()
      setCurrentUser(user)
    }
    fetchUser()
  }, [])

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
  const handleUpload = async (file: File, leaderId: string) => {
    if (!currentUser || !leaderId) {
      toast.error('User or Leader ID not found!')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await instance.post('/document', formData, { withCredentials: true })
      const fileUrl = uploadResponse.data.fileUrl

      const projectByLeader = await instance.get('/project/get-project-leader-for-supervisor', {
        withCredentials: true
      })

      const selectedProject = projectByLeader.data.data.find((p: Project) => p.leader === leaderId)

      const selectedProjectId = selectedProject ? selectedProject._id : null

      const documentData = {
        user: currentUser.id,
        project_id: selectedProjectId,
        fileUrl
      }

      const documentResponse = await instance.post('/documents', documentData, { withCredentials: true })

      setDocumentId(documentResponse.data.documentId)
      toast.success('Document uploaded successfully!')
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error('Failed to upload document!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className='bg-white grid p-1 gap-4'>
        <h2 className='text-2xl font-bold text-center'>Submit a Request</h2>
        <Form {...form}>
          <form className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='to_user'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To User (Leader)</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value} // Giữ giá trị từ form
                      onChange={(e) => {
                        const leaderId = e.target.value
                        setSelectedLeaderId(leaderId) // Cập nhật selectedLeaderId
                        field.onChange(leaderId) // Cập nhật giá trị của form
                      }}
                      className='border rounded p-2 w-full text-black bg-white'
                    >
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Document</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0]
                          setSelectedFile(file)  
                          field.onChange(file)  
                        }
                      }}
                      disabled={uploading}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    onClick={() => {
                      if (!selectedFile) {
                        toast.error('Please select a file first!')
                        return
                      }
                      handleUpload(selectedFile, selectedLeaderId)
                    }}
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
