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
import useMajor from '@/hooks/public/useMajor'
import { USER_STATUS } from '@/constants/status.enum'
import { Skeleton } from '@/components/ui/skeleton'
import { Teacher } from '@/types/management.type'

// Form Schema - Modified for Teacher
const teacherSchema = z.object({
  display_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  code: z.string().min(1, 'Teacher code is required'),
  campus: z.string().min(1, 'Campus is required'),
  major: z.array(z.string()).min(1, 'At least one major is required'),
  roles: z.array(z.enum(['lecturer', 'supervisor'])).min(1, 'At least one role is required'),
  status: z.number()
})

type TeacherFormValues = z.infer<typeof teacherSchema>

const TeacherFormSkeleton = () => {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
    </div>
  )
}

const TeacherUpdatePage = ({ id }: { id: string }) => {
  const { getTeacherDetails, updateTeacher } = useManagement()
  const { campuses } = useCampus()
  const { majors } = useMajor()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  // Initialize form with teacher-specific fields
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      display_name: '',
      email: '',
      code: '',
      campus: '',
      major: [],
      roles: [],
      status: 1
    }
  })

  const fetchTeacherDetails = async () => {
    setLoading(true)
    try {
      const res: Teacher = await getTeacherDetails({ _id: id })
      if (res) {
        // Set form values for teacher
        form.reset({
          display_name: res.display_name,
          email: res.email,
          code: res.code || '',
          campus: res.campus,
          major: res.major, // Note: Teacher major is already string[]
          roles: res.roles,
          status: res.status
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = form.formState.isValid && form.formState.isDirty

  useEffect(() => {
    fetchTeacherDetails()
  }, [id])

  const onSubmit = async (values: TeacherFormValues) => {
    try {
      const success = await updateTeacher({
        _id: id,
        ...values
      })
      if (success) {
        router.push('/management/teachers')
      }
    } catch (error) {
      toast.error('Failed to update teacher')
      console.error(error)
    }
  }

  if (loading || !campuses || !majors) {
    return (
      <div className='container mx-auto py-10'>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-[300px]' />
            <Skeleton className='h-4 w-[200px]' />
          </CardHeader>
          <CardContent>
            <TeacherFormSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-10'>
      <Card>
        <CardHeader>
          <CardTitle>Update Teacher Information</CardTitle>
          <CardDescription>Make changes to teacher details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Basic Fields */}
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
                    <FormLabel>Teacher Code</FormLabel>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {campuses.find((c) => c._id === field.value)?.name || 'Select campus'}
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

              {/* Majors - Using MultipleSelector */}
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

              {/* Roles - Using MultipleSelector */}
              <FormField
                control={form.control}
                name='roles'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        value={field.value.map((role) => ({
                          label: role.charAt(0).toUpperCase() + role.slice(1),
                          value: role
                        }))}
                        options={[
                          { label: 'Lecturer', value: 'lecturer' },
                          { label: 'Supervisor', value: 'supervisor' }
                        ]}
                        onChange={(options) => field.onChange(options.map((o) => o.value as 'lecturer' | 'supervisor'))}
                        placeholder='Select roles'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
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
                        {Object.entries(USER_STATUS)
                          .filter(([key]) => isNaN(Number(key)))
                          .map(([key, value]) => (
                            <SelectItem key={value} value={value.toString()}>
                              {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
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
                  Update Teacher
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherUpdatePage
