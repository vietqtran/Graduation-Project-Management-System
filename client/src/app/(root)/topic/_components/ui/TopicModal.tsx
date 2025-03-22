'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface TopicModalProps {
  topic: {
    _id: string
    name: string
    description: string
    major?: { _id: string; name: string }[] | { _id: string; name: string } | null
    field?: { _id: string; name: string }[] | { _id: string; name: string } | null
    campus?: { _id: string; name: string } | null
    category: number | string | null
    document?: string | null
  }
  type: 'update' | 'detail'
  onClose: () => void
  onSubmit?: () => void
}

const TopicModal: React.FC<TopicModalProps> = ({ topic, type, onClose, onSubmit }) => {
  interface FormValues {
    name: string
    description: string
    document: string
    major: string
    field: string
    campus: string
    category: string
  }
  console.log('Received Topic Data:', JSON.stringify(topic, null, 2))

  const normalizeMajor = (major?: { _id: string; name: string }[] | { _id: string; name: string } | null) => {
    if (Array.isArray(major)) {
      return major.length > 0 ? major[0]._id : ''
    }
    return major?._id || ''
  }

  const normalizeCategory = (category: number | string | null) => {
    return category ? category.toString() : '1'
  }

  const form = useForm<FormValues>({
    defaultValues: {
      name: topic.name || '',
      description: topic.description || '',
      major: normalizeMajor(topic.major),
      field: normalizeMajor(topic.field),
      campus: topic.campus?._id || '',
      category: normalizeCategory(topic.category),
      document: topic.document || ''
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Resetting form with values:', {
      name: topic.name || '',
      description: topic.description || '',
      major: normalizeMajor(topic.major),
      field: normalizeMajor(topic.field),
      campus: topic.campus?._id || '',
      category: normalizeCategory(topic.category),
      document: topic.document || ''
    })

    form.reset({
      name: topic.name || '',
      description: topic.description || '',
      major: normalizeMajor(topic.major),
      field: normalizeMajor(topic.field),
      campus: topic.campus?._id || '',
      category: normalizeCategory(topic.category),
      document: topic.document || ''
    })
  }, [topic, form])

  const handleSubmit: SubmitHandler<{
    name: string
    description: string
    document: string
    major: string
    field: string
    campus: string
    category: string
  }> = async (data) => {
    if (type !== 'update') return

    setLoading(true)
    try {
      await instance.patch(`/project/update-topic/${topic._id}`, data, { withCredentials: true })
      toast.success('Topic updated successfully!')
      if (onSubmit) onSubmit()
      onClose()
    } catch (error) {
      console.error('Error updating topic:', error)
      toast.error('Failed to update topic!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-auto'>
        <h2 className='text-lg font-bold mb-4'>{type === 'update' ? 'Edit Topic' : 'Topic Details'}</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='grid grid-cols-2 gap-4'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      {...field}
                      disabled={type === 'detail'}
                      placeholder={type === 'detail' ? field.value : 'Enter topic Name'}
                      className={type === 'detail' ? 'bg-gray-100' : ''}
                    />
                  </FormControl>
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
                  <Textarea
                    {...field}
                    disabled={type === 'detail'}
                    className={type === 'detail' ? 'bg-gray-100' : ''}
                  />
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
                      {...field}
                      type='file'
                      disabled={type === 'detail'}
                      className={type === 'detail' ? 'bg-gray-100' : ''}
                    />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={type === 'detail'}>
                    <SelectTrigger className={type === 'detail' ? 'bg-gray-100' : ''}>
                      <SelectValue placeholder='Select field' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='67a8ec0fd1eb085255e86f1d'>Software Engineering</SelectItem>
                      <SelectItem value='67a8ec7dd1eb085255e86f20'>Artificial Intelligence</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={type === 'detail'}>
                    <SelectTrigger className={type === 'detail' ? 'bg-gray-100' : ''}>
                      <SelectValue placeholder='Select major' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='67a8ecd0d1eb085255e86f21'>HE</SelectItem>
                      <SelectItem value='67a8ecf3d1eb085255e86f23'>HS</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={type === 'detail' ? () => {} : field.onChange}
                    value={field.value}
                    disabled={type === 'detail'}
                  >
                    <SelectTrigger className={type === 'detail' ? 'bg-gray-100' : ''}>
                      <SelectValue placeholder='Select campus' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='67a8eea9d1eb085255e86f2a'>Hòa Lạc</SelectItem>
                      <SelectItem value='67b6028c8d133eec2f0c2415'>TP Hồ Chí Minh</SelectItem>
                      <SelectItem value='67b602318d133eec2f0c2413'>Đà Nẵng</SelectItem>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={type === 'detail'}>
                    <SelectTrigger className={type === 'detail' ? 'bg-gray-100' : ''}>
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

            <div className='col-span-2 flex justify-end gap-2 mt-4'>
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
