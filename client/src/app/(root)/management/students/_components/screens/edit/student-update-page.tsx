'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useManagement from '@/hooks/useManagement'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import MultipleSelector from '@/components/ui/multi-select'
import useCampus from '@/hooks/public/useCampus'
import useField from '@/hooks/public/useField'
import useMajor from '@/hooks/public/useMajor'
import { USER_STATUS } from '@/constants/status.enum'
import { Skeleton } from '@/components/ui/skeleton'
import { Student } from '@/types/management.type'

// Form Schema
const studentSchema = z.object({
  display_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  code: z.string().min(1, 'Student code is required'),
  campus: z.string().min(1, 'Campus is required'),
  field: z.array(z.string()).min(1, 'At least one field is required'),
  major: z.array(z.string()).min(1, 'At least one major is required'),
  status: z.number()
})

type StudentFormValues = z.infer<typeof studentSchema>

const getStatusOptions = () => {
  return Object.entries(USER_STATUS)
    .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
    .map(([key, value]) => ({
      label: key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' '),
      value: value
    }))
}

const StudentFormSkeleton = () => {
  return (
    <div className='space-y-6'>
      {/* Name Field Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Email Field Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Student Code Field Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Campus Field Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Fields Selector Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Majors Selector Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Status Field Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Buttons Skeleton */}
      <div className='flex justify-end space-x-4'>
        <Skeleton className='h-10 w-[100px]' />
        <Skeleton className='h-10 w-[100px]' />
      </div>
    </div>
  )
}

const StudentUpdatePage = ({ id }: { id: string }) => {
  const { getStudentDetails, updateStudent } = useManagement()
  const { campuses } = useCampus()
  const { fields } = useField()
  const { majors } = useMajor()

  // const [studentDetails, setStudentDetails] = useState<Student | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  // Initialize form
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      display_name: '',
      email: '',
      code: '',
      campus: '',
      field: [],
      major: [],
      status: 1
    }
  })

  const fetchStudentDetails = async () => {
    setLoading(true)
    try {
      const res: Student = await getStudentDetails({ _id: id })
      if (res) {
        // Set form values when student details are loaded
        form.reset({
          display_name: res.display_name,
          email: res.email,
          code: res.code || '',
          campus: res.campus,
          field: res.field.map((f) => f._id),
          major: res.major.map((m) => m._id),
          status: res.status
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // constant to check if the form passes validation
  const isFormValid = form.formState.isValid && form.formState.isDirty

  useEffect(() => {
    fetchStudentDetails()
  }, [id])

  const onSubmit = async (values: StudentFormValues) => {
    console.log(values)

    try {
      const success = await updateStudent({
        _id: id,
        ...values
      })
      if (success) {
        router.push('/management/students')
      }
    } catch (error) {
      toast.error('Failed to update student')
      console.error(error)
    }
  }

  if (loading || !campuses || !fields || !majors) {
    return (
      <div className='container mx-auto py-10'>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-[300px]' />
            <Skeleton className='h-4 w-[200px]' />
          </CardHeader>
          <CardContent>
            <StudentFormSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-10'>
      <Card>
        <CardHeader>
          <CardTitle>Update Student Information</CardTitle>
          <CardDescription>Make changes to student details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='display_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {campuses.find((c) => c.name === field.value || c._id === field.value)?.name ||
                              'Select campus'}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campuses.map((campus) => (
                          <SelectItem key={campus._id} value={campus._id}>
                            {campus.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='field'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fields</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        value={field.value.map((f) => ({
                          label: fields.find((field) => field._id === f)?.name || f,
                          value: f
                        }))}
                        options={fields.map((f) => ({ label: f.name, value: f._id }))}
                        onChange={(options) => field.onChange(options.map((o) => o.value))}
                        placeholder='Select fields'
                      />
                    </FormControl>
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
                    <FormControl>
                      <MultipleSelector
                        value={field.value.map((m) => ({
                          label: majors.find((major) => major._id === m)?.name || m,
                          value: m
                        }))}
                        options={majors.map((m) => ({ label: m.name, value: m._id }))}
                        onChange={(options) => field.onChange(options.map((o) => o.value))}
                        placeholder='Select majors'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getStatusOptions().map((status) => (
                          <SelectItem key={status.value} value={status.value.toString()}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end space-x-4'>
                <Button variant='outline' type='button' onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type='submit' disabled={!isFormValid}>
                  Update Student
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentUpdatePage
