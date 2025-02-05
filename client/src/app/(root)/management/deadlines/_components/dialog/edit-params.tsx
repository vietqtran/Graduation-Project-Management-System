'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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

interface EditParamDialogProps {
  parameter: {
    _id: string
    param_name: string
    param_value: string
    param_type: 'string' | 'number' | 'boolean' | 'date'
    description?: string
  }
  onClose: () => void
}

const EditParamDialog = ({ parameter, onClose }: EditParamDialogProps) => {
  const { updateParameter } = useManagement()
  console.log(parameter)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ParamFormValues>({
    resolver: zodResolver(paramSchema),
    defaultValues: {
      param_name: parameter.param_name,
      param_value: parameter.param_value,
      param_type: parameter.param_type,
      description: parameter.description || ''
    }
  })

  useEffect(() => {
    reset({
      param_name: parameter.param_name,
      param_value: parameter.param_value,
      param_type: parameter.param_type,
      description: parameter.description || ''
    })
  }, [parameter, reset])

  const onSubmit = async (data: ParamFormValues) => {
    const response = await updateParameter({ _id: parameter._id, ...data })
    if (response === true) {
      reset()
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Parameter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label htmlFor='param_name'>Parameter Name</Label>
            <Input id='param_name' {...register('param_name')} />
            {errors.param_name && <p className='text-red-500 text-sm'>{errors.param_name.message}</p>}
          </div>
          <div>
            <Label htmlFor='param_value'>Value</Label>
            <Input id='param_value' {...register('param_value')} />
            {errors.param_value && <p className='text-red-500 text-sm'>{errors.param_value.message}</p>}
          </div>
          <div>
            <Label>Type</Label>
            <Select
              onValueChange={(value) => setValue('param_type', value as 'string' | 'number' | 'boolean' | 'date')}
              defaultValue={parameter.param_type}
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
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditParamDialog
