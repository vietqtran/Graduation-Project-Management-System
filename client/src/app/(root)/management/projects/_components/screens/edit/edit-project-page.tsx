'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FiArrowLeft } from 'react-icons/fi'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import useManagement from '@/hooks/useManagement'
import useField from '@/hooks/public/useField'
import useCampus from '@/hooks/public/useCampus'
import useMajor from '@/hooks/public/useMajor'
import { Project } from '@/types/project.type'
import { UserDto } from '@/types/management.type'
import { PROJECT_STATUS } from '@/constants/status.enum'
import { Checkbox } from '@/components/ui/checkbox'

// Create an array of status options for the dropdown
const PROJECT_STATUS_OPTIONS = [
  { value: PROJECT_STATUS.PENDING.toString(), label: 'Pending' },
  { value: PROJECT_STATUS.APPROVED.toString(), label: 'Approved' },
  { value: PROJECT_STATUS.REJECTED.toString(), label: 'Rejected' },
  { value: PROJECT_STATUS.SUBMITTED.toString(), label: 'Submitted' },
  { value: PROJECT_STATUS.CANCELLED.toString(), label: 'Cancelled' },
  { value: PROJECT_STATUS.BLOCKED.toString(), label: 'Blocked' },
  { value: PROJECT_STATUS.UN_ACTIVE.toString(), label: 'Inactive' }
]

// Form schema for project edit
const projectFormSchema = z.object({
  name: z.string().min(3, { message: 'Project name must be at least 3 characters' }),
  description: z.string().optional(),
  major: z.array(z.string()),
  field: z.array(z.string()),
  campus: z.string().min(1, { message: 'Campus is required' }),
  mark: z.number().nullable().optional(),
  category: z.union([z.literal('1'), z.literal('2')]),
  status: z.string(),
  stage: z.union([z.literal('0'), z.literal('1'), z.literal('2'), z.literal('3')]),
  slow_count: z.number().int().min(0),
  members: z.array(z.string()),
  supervisor: z.array(z.string()),
  leader: z.string()
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

const EditProjectPage = ({ id }: { id: string | string[] | undefined }) => {
  const router = useRouter()
  const { getDetailsProjects, updateProject, getListAvailableStudents, getListAvailabbleSupervisors } = useManagement()
  const { fields } = useField()
  const { campuses } = useCampus()
  const { majors } = useMajor()

  // const [projectDetails, setProjectDetails] = useState<Project | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [availableStudents, setAvailableStudents] = useState<UserDto[]>([])
  const [availableSupervisors, setAvailableSupervisors] = useState<UserDto[]>([])
  const [currentMembers, setCurrentMembers] = useState<UserDto[]>([])
  const [currentSupervisors, setCurrentSupervisors] = useState<UserDto[]>([])

  // Initialize the form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      major: [],
      field: [],
      campus: '',
      mark: null,
      category: '1',
      status: '1',
      stage: '0',
      slow_count: 0,
      members: [],
      supervisor: [],
      leader: ''
    }
  })

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return

      setLoading(true)
      try {
        const res = (await getDetailsProjects({ _id: id as string })) as Project
        if (res) {
          // Extract member objects if they exist
          const memberObjects = Array.isArray(res.members)
            ? (res.members.filter((m) => typeof m === 'object' && m !== null) as UserDto[])
            : []
          setCurrentMembers(memberObjects)

          // Extract supervisor objects if they exist
          const supervisorObjects = Array.isArray(res.supervisor)
            ? (res.supervisor.filter((s) => typeof s === 'object' && s !== null) as UserDto[])
            : []
          setCurrentSupervisors(supervisorObjects)

          // Set form values from project details
          form.reset({
            name: res.name,
            description: res.description || '',
            major: Array.isArray(res.major)
              ? res.major.map((m) => (typeof m === 'object' && m !== null ? m._id : m))
              : [],
            field: Array.isArray(res.field)
              ? res.field.map((f) => (typeof f === 'object' && f !== null ? f._id : f))
              : [],
            campus: res.campus._id || '',
            mark: res.mark || null,
            category: res.category?.toString() as '1' | '2',
            status: res.status?.toString(),
            stage: res.stage?.toString() as '0' | '1' | '2' | '3',
            slow_count: res.slow_count || 0,
            members: Array.isArray(res.members)
              ? res.members.map((m) => (typeof m === 'object' && m !== null ? m._id : m))
              : [],
            supervisor: Array.isArray(res.supervisor)
              ? res.supervisor.map((s) => (typeof s === 'object' && s !== null ? s._id : s))
              : [],
            leader: res.leader && typeof res.leader === 'object' ? res.leader._id : res.leader || ''
          })
        }
      } catch (error) {
        console.error('Error fetching project details:', error)
        toast.error('Failed to fetch project details')
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id, form])

  // Fetch available students and supervisors
  useEffect(() => {
    const fetchAvailableData = async () => {
      try {
        const [studentsRes, supervisorsRes] = await Promise.all([
          getListAvailableStudents({}),
          getListAvailabbleSupervisors({})
        ])

        if (studentsRes) setAvailableStudents(studentsRes)
        if (supervisorsRes) setAvailableSupervisors(supervisorsRes)
      } catch (error) {
        console.error('Error fetching available resources:', error)
      }
    }

    fetchAvailableData()
  }, [])

  // Handle form submission
  const onSubmit = async (values: ProjectFormValues) => {
    if (!id) return

    setSubmitting(true)
    try {
      const result = await updateProject({
        _id: id as string,
        name: values.name,
        description: values.description,
        major: values.major,
        field: values.field,
        campus: values.campus,
        mark: values.mark !== null ? values.mark : undefined,
        category: parseInt(values.category) as 1 | 2,
        status: parseInt(values.status),
        stage: parseInt(values.stage),
        slow_count: values.slow_count,
        members: values.members,
        supervisor: values.supervisor,
        leader: values.leader
      })

      if (result) {
        toast.success('Project updated successfully')
        router.push(`/management/projects/${id}/details`)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    } finally {
      setSubmitting(false)
    }
  }

  // // Function to get student name for display
  // const getStudentName = (studentId: string) => {
  //   const student = availableStudents.find((s) => s._id === studentId)
  //   return student ? student.display_name : studentId
  // }

  // // Function to get supervisor name for display
  // const getSupervisorName = (supervisorId: string) => {
  //   const supervisor = availableSupervisors.find((s) => s._id === supervisorId)
  //   return supervisor ? supervisor.display_name : supervisorId
  // }

  // // Function to check if a student is already a member
  // const isStudentMember = (studentId: string) => {
  //   return form.watch('members').includes(studentId)
  // }

  // // Function to check if a teacher is already a supervisor
  // const isTeacherSupervisor = (teacherId: string) => {
  //   return form.watch('supervisor').includes(teacherId)
  // }

  return (
    <div className='p-6 space-y-6'>
      <Button variant='ghost' className='mb-4' onClick={() => router.back()}>
        <FiArrowLeft className='mr-2' size={16} />
        Back
      </Button>

      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Edit Project</h1>
      </div>

      {loading ? (
        <div className='space-y-4'>
          <Skeleton className='h-12 w-2/3' />
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter project name' {...field} />
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
                        <Textarea placeholder='Enter project description' className='h-24' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='1'>Category 1</SelectItem>
                            <SelectItem value='2'>Category 2</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROJECT_STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='campus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select campus' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campuses?.map((campus) => (
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
                    name='stage'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select stage' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='0'>Forming</SelectItem>
                            <SelectItem value='1'>Development</SelectItem>
                            <SelectItem value='2'>Defense</SelectItem>
                            <SelectItem value='3'>Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='major'
                    render={() => (
                      <FormItem>
                        <FormLabel>Majors</FormLabel>
                        <div className='space-y-2'>
                          {majors?.map((major) => (
                            <FormField
                              key={major._id}
                              control={form.control}
                              name='major'
                              render={({ field }) => {
                                return (
                                  <FormItem key={major._id} className='flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(major._id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, major._id])
                                            : field.onChange(field.value?.filter((value) => value !== major._id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{major.name}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='field'
                    render={() => (
                      <FormItem>
                        <FormLabel>Fields</FormLabel>
                        <div className='space-y-2'>
                          {fields?.map((field) => (
                            <FormField
                              key={field._id}
                              control={form.control}
                              name='field'
                              render={({ field: formField }) => {
                                return (
                                  <FormItem key={field._id} className='flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                      <Checkbox
                                        checked={formField.value?.includes(field._id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? formField.onChange([...formField.value, field._id])
                                            : formField.onChange(
                                                formField.value?.filter((value) => value !== field._id)
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{field.name}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='leader'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Leader</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select team leader' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.watch('members').map((memberId) => {
                            const member =
                              currentMembers.find((m) => m._id === memberId) ||
                              availableStudents.find((s) => s._id === memberId)
                            return (
                              <SelectItem key={memberId} value={memberId}>
                                {member ? member.display_name : memberId} {member?.email ? `(${member.email})` : ''}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormDescription>The leader must be one of the team members</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='members'
                      render={() => (
                        <FormItem>
                          <FormLabel>Current Team Members</FormLabel>
                          <div className='space-y-2'>
                            {currentMembers.map((member) => (
                              <FormField
                                key={member._id}
                                control={form.control}
                                name='members'
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={member._id}
                                      className='flex flex-row items-start space-x-3 space-y-0'
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(member._id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, member._id])
                                              : field.onChange(field.value?.filter((value) => value !== member._id))
                                          }}
                                        />
                                      </FormControl>
                                      <div className='flex items-center space-x-2'>
                                        <Avatar className='h-6 w-6'>
                                          <AvatarImage src={member.avatar} alt={member.display_name} />
                                          <AvatarFallback>{member.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <FormLabel className='font-normal'>
                                          {member.display_name}
                                          <span className='text-xs text-muted-foreground ml-1'>({member.email})</span>
                                        </FormLabel>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormDescription className='mt-2'>Uncheck to remove a member</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='members'
                      render={() => (
                        <FormItem>
                          <FormLabel>Add New Members</FormLabel>
                          <div className='space-y-2 max-h-60 overflow-y-auto'>
                            {availableStudents.length > 0 ? (
                              availableStudents
                                .filter((student) => !currentMembers.some((m) => m._id === student._id))
                                .map((student) => (
                                  <FormField
                                    key={student._id}
                                    control={form.control}
                                    name='members'
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={student._id}
                                          className='flex flex-row space-x-3 space-y-0 items-center'
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(student._id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, student._id])
                                                  : field.onChange(
                                                      field.value?.filter((value) => value !== student._id)
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <div className='flex items-center space-x-2'>
                                            <Avatar className='h-6 w-6'>
                                              <AvatarImage src={student.avatar} alt={student.display_name} />
                                              <AvatarFallback>
                                                {student.display_name.charAt(0).toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <FormLabel className='font-normal'>
                                              {student.display_name}
                                              <span className='text-xs text-muted-foreground ml-1'>
                                                ({student.email})
                                              </span>
                                            </FormLabel>
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))
                            ) : (
                              <div className='text-sm text-muted-foreground'>No available members</div>
                            )}
                          </div>
                          <FormDescription className='mt-2'>Check to add a new member</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='supervisor'
                      render={() => (
                        <FormItem>
                          <FormLabel>Current Supervisors</FormLabel>
                          <div className='space-y-2'>
                            {currentSupervisors.map((supervisor) => (
                              <FormField
                                key={supervisor._id}
                                control={form.control}
                                name='supervisor'
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={supervisor._id}
                                      className='flex flex-row items-center space-x-3 space-y-0'
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(supervisor._id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, supervisor._id])
                                              : field.onChange(field.value?.filter((value) => value !== supervisor._id))
                                          }}
                                        />
                                      </FormControl>
                                      <div className='flex items-center space-x-2'>
                                        <Avatar className='h-6 w-6'>
                                          <AvatarImage src={supervisor.avatar} alt={supervisor.display_name} />
                                          <AvatarFallback>
                                            {supervisor.display_name.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <FormLabel className='font-normal'>
                                          {supervisor.display_name}
                                          <span className='text-xs text-muted-foreground ml-1'>
                                            ({supervisor.email})
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormDescription className='mt-2'>Uncheck to remove a supervisor</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='supervisor'
                      render={() => (
                        <FormItem>
                          <FormLabel>Add New Supervisors</FormLabel>
                          <div className='space-y-2 max-h-60 overflow-y-auto'>
                            {availableSupervisors.length > 0 ? (
                              availableSupervisors
                                .filter((supervisor) => !currentSupervisors.some((s) => s._id === supervisor._id))
                                .map((supervisor) => (
                                  <FormField
                                    key={supervisor._id}
                                    control={form.control}
                                    name='supervisor'
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={supervisor._id}
                                          className='flex flex-row items-start space-x-3 space-y-0'
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(supervisor._id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, supervisor._id])
                                                  : field.onChange(
                                                      field.value?.filter((value) => value !== supervisor._id)
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <div className='flex items-center space-x-2'>
                                            <Avatar className='h-6 w-6'>
                                              <AvatarImage src={supervisor.avatar} alt={supervisor.display_name} />
                                              <AvatarFallback>
                                                {supervisor.display_name.charAt(0).toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <FormLabel className='font-normal'>
                                              {supervisor.display_name}
                                              <span className='text-xs text-muted-foreground ml-1'>
                                                ({supervisor.email})
                                              </span>
                                            </FormLabel>
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))
                            ) : (
                              <div className='text-sm text-muted-foreground'>No available supervisors</div>
                            )}
                          </div>
                          <FormDescription className='mt-2'>Check to add a new supervisor</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='mark'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Mark</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter project mark'
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            value={field.value === null ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='slow_count'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Submission Count</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter late submission count'
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' type='button' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default EditProjectPage
