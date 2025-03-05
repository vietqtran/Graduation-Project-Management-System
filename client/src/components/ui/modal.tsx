'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface ModalProps {
  topic: { _id: string; name: string; description: string }
  type: 'update' | 'detail'
  onClose: () => void
  onSubmit?: (data: { name: string; description: string }) => void
}

const Modal: React.FC<ModalProps> = ({ topic, type, onClose, onSubmit }) => {
  const form = useForm<{ name: string; description: string }>({
    defaultValues: { name: topic.name, description: topic.description },
  })

  useEffect(() => {
    form.reset({ name: topic.name, description: topic.description })
  }, [topic, form])

  const handleSubmit: SubmitHandler<{ name: string; description: string }> = (data) => {
    if (onSubmit) onSubmit(data)
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-lg font-bold mb-4'>{type === 'update' ? 'Edit Topic' : 'Topic Details'}</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    {type === 'update' ? (
                      <input type='text' {...field} className='w-full p-2 border rounded' />
                    ) : (
                      <p className='border p-2 rounded'>{field.value}</p>
                    )}
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
                    {type === 'update' ? (
                      <textarea {...field} className='w-full p-2 border rounded' />
                    ) : (
                      <p className='border p-2 rounded'>{field.value}</p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 mt-4'>
              {type === 'update' && (
                <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
                  Update
                </button>
              )}
              <button type='button' onClick={onClose} className='bg-gray-400 text-white px-4 py-2 rounded'>
                Close
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Modal
