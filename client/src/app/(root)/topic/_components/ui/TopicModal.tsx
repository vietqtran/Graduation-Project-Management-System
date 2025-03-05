'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface TopicModalProps {
  topic: { _id: string; name: string; description: string }
  type: 'update' | 'detail'
  onClose: () => void
  onSubmit?: () => void  
}

const TopicModal: React.FC<TopicModalProps> = ({ topic, type, onClose, onSubmit }) => {
  const form = useForm<{ name: string; description: string }>({
    defaultValues: { name: topic.name, description: topic.description },
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Topic data:', topic);
    form.reset({ name: topic.name, description: topic.description })
  }, [topic, form])

  const handleSubmit: SubmitHandler<{ name: string; description: string }> = async (data) => {
    if (type !== 'update') return

    setLoading(true)
    try {
      await instance.patch(`/project/update-topic/${topic._id}`, data, { withCredentials: true })
      toast.success('Topic updated successfully!')
      if (onSubmit) onSubmit() // Gọi lại để refresh danh sách topic
      onClose() // Đóng modal
    } catch (error) {
      console.error('Error updating topic:', error)
      toast.error('Failed to update topic!')
    } finally {
      setLoading(false)
    }
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
                <Button type='submit' variant='default' disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
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

export default TopicModal
