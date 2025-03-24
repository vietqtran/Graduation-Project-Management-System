'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpload } from '@/hooks/useUpload'
import instance from '@/utils/axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface TopicFormProps {
  onSubmit: (data: {
    name: string
    description: string
    major: string
    field: string
    document: string
    campus: string
    category: string
    leader: string
  }) => void
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      major: '',
      field: '',
      document: '',
      campus: '',
      category: '',
      leader: ''
    }
  })

  const { upload } = useUpload()
  const [uploading, setUploading] = useState(false)
  const [documentId, setDocumentId] = useState<string | null>(null) // Lưu ID tài liệu

  const [majors, setMajors] = useState<string[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [campuses, setCampuses] = useState<string[]>([])

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await instance.get('/public/majors')
        setMajors(response.data.data)
      } catch (error) {
        console.error('Error fetching majors:', error)
      }
    }

    const fetchFields = async () => {
      try {
        const response = await instance.get('/public/fields')
        setFields(response.data.data)
      } catch (error) {
        console.error('Error fetching fields:', error)
      }
    }

    const fetchCampuses = async () => {
      try {
        const response = await instance.get('/public/campuses')
        setCampuses(response.data.data)
      } catch (error) {
        console.error('Error fetching campuses:', error)
      }
    }

    fetchMajors()
    fetchFields()
    fetchCampuses()
  }, [])
  async function handleUpload(file: File) {
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
      toast.success('File uploaded successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className='bg-white grid p-1 gap-4'>
        <h2 className='text-2xl font-bold text-center mt-12'>Submit a New Topic</h2>
        <Form {...form}>
          <form className='grid grid-cols-2 gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic Name</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Enter topic name' {...field} />
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
                    <Textarea placeholder='Provide detailed description' rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='major'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Majors</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select major' />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='field'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select field' />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              name='campus'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campus</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select campus' />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1'>From Student</SelectItem>
                      <SelectItem value='2'>From Teacher</SelectItem>
                      <SelectItem value='3'>From School</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='leader'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leader (optional)</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Enter leader code' {...field} />
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

export default TopicForm
