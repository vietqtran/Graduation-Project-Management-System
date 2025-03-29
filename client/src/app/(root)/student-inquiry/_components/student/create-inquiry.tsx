'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useStudentInquiry from '@/hooks/useStudentInquiry'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks'

// Define the validation schema based on the model
const createInquirySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  content: z.string().min(1, 'Content is required').max(10000, 'Content cannot exceed 10000 characters')
})

type CreateInquiryFormValues = z.infer<typeof createInquirySchema>

const CreateInquiry = () => {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const isStudent = user?.roles.some((role) => role === 'student')

  if (!isStudent) {
    toast.error('You are not authorized to create an inquiry')
    router.push('/student-inquiry')
  }

  const { studentCreateInquiry } = useStudentInquiry()

  const form = useForm<CreateInquiryFormValues>({
    resolver: zodResolver(createInquirySchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })

  const onSubmit = async (data: CreateInquiryFormValues) => {
    try {
      const response = await studentCreateInquiry(data)
      if (response) {
        router.push('/student-inquiry')
      }
    } catch (error) {
      console.error('Error creating inquiry:', error)
    }
  }

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Inquiry</CardTitle>
          <CardDescription>Submit your inquiry and we will get back to you as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your inquiry title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Describe your inquiry in detail...' className='min-h-[200px]' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end space-x-4'>
                <Button type='button' variant='outline' onClick={() => router.push('/student-inquiry')}>
                  Cancel
                </Button>
                <Button type='submit' disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating...' : 'Create Inquiry'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateInquiry
