'use client'

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import instance from '@/utils/axios'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface RequestModalProps {
  request: {
    _id: string
    to_user: string
    from_user: string
    status: string
    approve_user?: string
    remark: string
    type: string
    description?: string
    documents?: string[]
    due_date?: string
  }
  type: 'update' | 'detail'
  onClose: () => void
  onSubmit?: () => void
}

const RequestModal: React.FC<RequestModalProps> = ({ request, type, onClose, onSubmit }) => {
  interface FormValues {
    to_user: string
    from_user: string
    status: string
    approve_user?: string
    remark: string
    type: string
    description?: string
    due_date?: string
  }

  const form = useForm<FormValues>({
    defaultValues: {
      to_user: request.to_user || '',
      from_user: request.from_user || '',
      status: request.status || 'assigned',
      approve_user: '',
      remark: request.remark || '',
      type: request.type || 'project',
      description: request.description || '',
      due_date: request.due_date || ''
    }
  })

  useEffect(() => {
    form.reset({
      to_user: request.to_user || '',
      from_user: request.from_user || '',
      status: request.status || 'assigned',
      approve_user: request.approve_user || '',
      remark: request.remark || '',
      type: request.type || 'project',
      description: request.description || '',
      due_date: request.due_date || ''
    })
  }, [request, form])

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    if (type !== 'update') return

    try {
      await instance.patch(`/request/update-request/${request._id}`, data, { withCredentials: true })
      toast.success('Request updated successfully!')
      if (onSubmit) onSubmit()
      onClose()
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Failed to update request!')
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-auto'>
        <h2 className='text-lg font-bold mb-4'>{type === 'update' ? 'Edit Request' : 'Request Details'}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='grid grid-cols-2 gap-4'>
            <FormField
              name='status'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select disabled={type === 'detail'} onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      {['assigned', 'submitted', 'completed', 'in progress', 'overdue'].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='type'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select disabled={type === 'detail'} onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      {['project', 'defense', 'extension', 'other'].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Description</FormLabel>
                  <Textarea {...field} disabled={type === 'detail'} className='w-full' />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='due_date'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <Input type='date' {...field} disabled={type === 'detail'} className='w-full' />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='remark'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <Input {...field} disabled={type === 'detail'} className='w-full' />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='col-span-2 flex justify-end gap-2 mt-4'>
              {type === 'update' && (
                <Button type='submit' variant='default'>
                  Update
                </Button>
              )}
              <Button type='button' onClick={onClose} variant='ghost'>
                Close
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default RequestModal
