'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DeadlinesResponse } from '@/types/management.type'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import useManagement from '@/hooks/useManagement'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
// Enable custom parsing for Day.js
dayjs.extend(customParseFormat)

// Zod schema for validation
const deadlineSchema = z.object({
  deadline_key: z.string().min(1, 'Deadline key is required'),
  deadline_date: z.preprocess(
    (val) => (typeof val === 'string' ? dayjs(val).toDate() : val),
    z.date({ required_error: 'Deadline date is required' })
  ),
  deadline_time: z.string().min(1, 'Time is required'),
  semester: z.string().min(1, 'Semester is required')
})

type DeadlineFormValues = z.infer<typeof deadlineSchema>

interface EditDeadlineDialogProps {
  deadline: DeadlinesResponse[0]
  onClose: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditDeadlineDialog = ({ deadline, onClose, open, onOpenChange }: EditDeadlineDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateDeadline } = useManagement()

  // Format the time for the time input (HH:MM format)
  const getTimeFromDate = (date: Date) => {
    return dayjs(date).format('HH:mm')
  }

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
      deadline_time: getTimeFromDate(dayjs(deadline.deadline_date).toDate()),
      semester: deadline.semester
    }
  })

  const selectedDate = watch('deadline_date')
  const selectedTime = watch('deadline_time')

  useEffect(() => {
    reset({
      deadline_key: deadline.deadline_key,
      deadline_date: dayjs(deadline.deadline_date).toDate(),
      deadline_time: getTimeFromDate(dayjs(deadline.deadline_date).toDate()),
      semester: deadline.semester
    })
  }, [deadline, reset])

  const onSubmit = async (data: DeadlineFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await updateDeadline({
        deadline_key: data.deadline_key,
        deadline_date: data.deadline_date,
        semester: data.semester
      })

      if (response) {
        reset()
        onOpenChange(false)
        onClose()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format the current date for display
  const formattedDate = selectedDate 
    ? dayjs(selectedDate).format('YYYY-MM-DD') 
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          {/* Calendar directly in the form */}
          <div>
            <Label>Deadline Date</Label>
            <div className="border rounded-md p-2 mt-1">
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={(date) => date && setValue('deadline_date', date)}
                className="mx-auto"
              />
            </div>
            {errors.deadline_date && <p className='text-red-500 text-sm'>{errors.deadline_date.message}</p>}
          </div>

          {/* Time Input */}
          <div>
            <Label htmlFor='deadline_time'>Time</Label>
            <Input 
              id='deadline_time' 
              type='time' 
              {...register('deadline_time')} 
            />
            {errors.deadline_time && <p className='text-red-500 text-sm'>{errors.deadline_time.message}</p>}
          </div>

          {/* Selected Date and Time Display */}
          <div className="text-sm text-muted-foreground">
            Selected: {formattedDate} {selectedTime}
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