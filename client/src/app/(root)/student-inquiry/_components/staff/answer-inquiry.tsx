'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useStudentInquiry from '@/hooks/useStudentInquiry'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks'
import { StudentInquiry } from '@/types/student-inquiry.type'

// Define the validation schema based on the model
const answerInquirySchema = z.object({
  answer: z.string().min(1, 'Answer is required').max(10000, 'Answer cannot exceed 10000 characters')
})

type AnswerInquiryFormValues = z.infer<typeof answerInquirySchema>

const AnswerInquiry = ({ id }: { id: string }) => {
  const router = useRouter()
  const inquiryId = id
  const { user } = useAppSelector((state) => state.auth)
  const isStaff = user?.roles.some((role) => role === 'staff')

  if (!isStaff) {
    toast.error('You are not authorized to answer inquiries')
    router.push('/student-inquiry')
  }

  const { staffAnswerStudentInquiry, staffGetInquiryById } = useStudentInquiry()
  const [inquiry, setInquiry] = useState<StudentInquiry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInquiry = async () => {
      if (!inquiryId) {
        router.push('/student-inquiry')
        return
      }

      try {
        const response = await staffGetInquiryById({ _id: inquiryId })
        if (response) {
          setInquiry(response)
        } else {
          toast.error('Inquiry not found')
          router.push('/student-inquiry')
        }
      } catch (error) {
        console.error('Error fetching inquiry:', error)
        toast.error('Error fetching inquiry')
        router.push('/student-inquiry')
      } finally {
        setLoading(false)
      }
    }

    fetchInquiry()
  }, [inquiryId, router])

  const form = useForm<AnswerInquiryFormValues>({
    resolver: zodResolver(answerInquirySchema),
    defaultValues: {
      answer: ''
    }
  })

  const onSubmit = async (data: AnswerInquiryFormValues) => {
    if (!inquiryId) {
      toast.error('No inquiry ID provided')
      return
    }

    try {
      const response = await staffAnswerStudentInquiry({
        _id: inquiryId,
        answer: data.answer
      })
      if (response) {
        toast.success('Inquiry answered successfully')
        router.push('/student-inquiry')
      }
    } catch (error) {
      console.error('Error answering inquiry:', error)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto py-6'>
        <Card>
          <CardHeader>
            <CardTitle>Loading Inquiry...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='animate-pulse space-y-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              <div className='h-32 bg-gray-200 rounded'></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inquiry) {
    return null
  }

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader>
          <CardTitle>Answer Inquiry</CardTitle>
          <CardDescription>Provide a detailed answer to the student&apos;s inquiry.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6'>
            <h3 className='text-lg font-semibold mb-2'>Student&apos;s Inquiry:</h3>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h4 className='font-medium mb-2'>{inquiry.title}</h4>
              <p className='text-gray-600 whitespace-pre-wrap'>{inquiry.content}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='answer'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Answer</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter your answer here...' className='min-h-[200px]' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end space-x-4'>
                <Button type='button' variant='outline' onClick={() => router.push('/student-inquiry')}>
                  Cancel
                </Button>
                <Button type='submit' disabled={form.formState.isSubmitting || !form.formState.isValid}>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnswerInquiry
