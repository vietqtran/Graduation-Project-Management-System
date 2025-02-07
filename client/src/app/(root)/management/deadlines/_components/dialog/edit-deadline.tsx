'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useManagement from '@/hooks/useManagement'
import { DeadlinesResponse } from '@/types/management.type'

// Enable custom parsing for Day.js
dayjs.extend(customParseFormat)

// Zod schema for validation
const deadlineSchema = z.object({
  deadline_key: z.string().min(1, 'Deadline key is required'),
  deadline_date: z.preprocess(
    (val) => (typeof val === 'string' ? dayjs(val).toDate() : val),
    z.date({ required_error: 'Deadline date is required' })
  ),
  semester: z.string().min(1, 'Semester is required')
})

type DeadlineFormValues = z.infer<typeof deadlineSchema>

interface EditDeadlineDialogProps {
  deadline: DeadlinesResponse[0]
  onClose: () => void
}

const EditDeadlineDialog = ({ deadline, onClose }: EditDeadlineDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateDeadline } = useManagement()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<DeadlineFormValues>({
    resolver: zodResolver(deadlineSchema),
    defaultValues: {
      deadline_key: deadline.deadline_key,
      deadline_date: dayjs(deadline.deadline_date).toDate(),
      semester: deadline.semester
    }
  })

  const selectedDate = watch('deadline_date')

  useEffect(() => {
    reset({
      deadline_key: deadline.deadline_key,
      deadline_date: dayjs(deadline.deadline_date).toDate(),
      semester: deadline.semester
    })
  }, [deadline, reset])

  const onSubmit = async (data: DeadlineFormValues) => {
    setIsSubmitting(true)
    const response = await updateDeadline({
      deadline_key: data.deadline_key,
      deadline_date: data.deadline_date,
      semester: data.semester
    })

    if (response) {
      onClose()
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Deadline</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Deadline Key */}
          <div>
            <Label htmlFor='deadline_key'>Deadline Key</Label>
            <Input id='deadline_key' {...register('deadline_key')} />
            {errors.deadline_key && <p className='text-red-500 text-sm'>{errors.deadline_key.message}</p>}
          </div>

          {/* Deadline Date (Shadcn Date Picker with Day.js) */}
          <div>
            <Label htmlFor='deadline_date'>Deadline Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-full'>
                  {selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD HH:mm:ss') : 'Pick a date & time'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={selectedDate}
                  onSelect={(date) => date && setValue('deadline_date', dayjs(date).toDate())}
                />
              </PopoverContent>
            </Popover>
            {errors.deadline_date && <p className='text-red-500 text-sm'>{errors.deadline_date.message}</p>}
          </div>

          {/* Semester */}
          <div>
            <Label htmlFor='semester'>Semester</Label>
            <Input id='semester' {...register('semester')} />
            {errors.semester && <p className='text-red-500 text-sm'>{errors.semester.message}</p>}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Deadline'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDeadlineDialog
