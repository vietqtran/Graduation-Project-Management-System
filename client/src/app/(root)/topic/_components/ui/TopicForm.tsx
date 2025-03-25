'use client'

import { forwardRef, useImperativeHandle } from 'react'
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

interface Major {
  _id: string
  name: string
  description: string
}

interface Field {
  _id: string
  name: string
  description: string
}

interface Campus {
  _id: string
  name: string
  description: string
}

interface FormData {
  name: string
  description: string
  major: string
  field: string
  document: string
  campus: string
  category: string
  leader: string
}

interface TopicFormProps {
  onSubmit: (data: FormData) => void
  loading?: boolean
}

const TopicForm = forwardRef<{ submit: () => void }, TopicFormProps>(({ onSubmit, loading }, ref) => {
  const form = useForm<FormData>({
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
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [majors, setMajors] = useState<Major[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await instance.get('/public/majors')
        setMajors(response.data.data)
      } catch (error) {
        console.error('Error fetching majors:', error)
        toast.error('Failed to load majors')
      }
    }

    const fetchFields = async () => {
      try {
        const response = await instance.get('/public/fields')
        setFields(response.data.data)
      } catch (error) {
        console.error('Error fetching fields:', error)
        toast.error('Failed to load fields')
      }
    }

    const fetchCampuses = async () => {
      try {
        const response = await instance.get('/public/campuses')
        setCampuses(response.data.data)
      } catch (error) {
        console.error('Error fetching campuses:', error)
        toast.error('Failed to load campuses')
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
      if (!fileResult?.key) {
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

  const handleSubmit = async (data: FormData) => {
    const submitData = { ...data, document: documentId || '' }
    onSubmit(submitData)
  }

  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit(handleSubmit)()
  }))

  return (
    <div>
      <div className="bg-white grid p-1 gap-4">
        <h2 className="text-2xl font-bold text-center mt-12">Submit a New Topic</h2>
        <Form {...form}>
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter topic name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide detailed description" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Majors</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major._id} value={major._id}>
                          {major.name}
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
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field._id} value={field._id}>
                          {field.name}
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
              name="document"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Document</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(file)
                      }}
                      disabled={uploading || loading}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() => documentId && toast.success('Document already uploaded!')}
                    disabled={uploading || !!documentId || loading}
                    className="mt-2"
                  >
                    {uploading ? 'Uploading...' : documentId ? 'Uploaded' : 'Upload'}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="campus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campus</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((campus) => (
                        <SelectItem key={campus._id} value={campus._id}>
                          {campus.name}
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">From Student</SelectItem>
                      <SelectItem value="2">From Teacher</SelectItem>
                      <SelectItem value="3">From School</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leader"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leader (optional)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter leader code" {...field} />
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
})

// Gán displayName cho component
TopicForm.displayName = 'TopicForm'

export default TopicForm