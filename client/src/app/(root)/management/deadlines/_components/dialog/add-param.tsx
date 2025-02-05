'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod' // Update the import path if necessary
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useManagement from '@/hooks/useManagement'

// Validation Schema
const paramSchema = z.object({
  param_name: z.string().min(1, 'Parameter name is required'),
  param_value: z.string().min(1, 'Value is required'),
  param_type: z.enum(['string', 'number', 'boolean', 'date']),
  description: z.string().optional()
})

type ParamFormValues = z.infer<typeof paramSchema>

const AddParamDialog = ({ children, onSuccess }: { children: React.ReactNode; onSuccess: () => void }) => {
  const [open, setOpen] = useState(false)
  const { createParameter } = useManagement()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ParamFormValues>({
    resolver: zodResolver(paramSchema),
    defaultValues: {
      param_name: '',
      param_value: '',
      param_type: 'string',
      description: ''
    }
  })

  const onSubmit = async (data: ParamFormValues) => {
    const response = await createParameter(data)
    if (response === true) {
      reset()
      onSuccess()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Parameter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Parameter Name */}
          <div>
            <Label htmlFor='param_name'>Parameter Name</Label>
            <Input id='param_name' {...register('param_name')} placeholder='Enter parameter name' />
            {errors.param_name && <p className='text-red-500 text-sm'>{errors.param_name.message}</p>}
          </div>

          {/* Parameter Value */}
          <div>
            <Label htmlFor='param_value'>Value</Label>
            <Input id='param_value' {...register('param_value')} placeholder='Enter value' />
            {errors.param_value && <p className='text-red-500 text-sm'>{errors.param_value.message}</p>}
          </div>

          {/* Parameter Type */}
          <div>
            <Label>Type</Label>
            <Select
              onValueChange={(value) => setValue('param_type', value as 'string' | 'number' | 'boolean' | 'date')}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='string'>String</SelectItem>
                <SelectItem value='number'>Number</SelectItem>
                <SelectItem value='boolean'>Boolean</SelectItem>
                <SelectItem value='date'>Date</SelectItem>
              </SelectContent>
            </Select>
            {errors.param_type && <p className='text-red-500 text-sm'>{errors.param_type.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor='description'>Description</Label>
            <Input id='description' {...register('description')} placeholder='Enter description (optional)' />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Parameter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddParamDialog
