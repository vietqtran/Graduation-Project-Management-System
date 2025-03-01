'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'

interface TopicFormProps {
  onSubmit: (data: { name: string; description: string; skills: string; capacity: string; prequisite: string; duration: string; category: string; campus: string; }) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      skills: '',
      capacity: '',
      prequisite: '',
      duration: '',
      category: '',
      campus: ''
    }
  })

  return (
    <div>
      <div className='bg-white grid p-1 gap-4'>
        <h2 className='text-2xl font-bold text-center mt-12'>Submit a New Topic</h2>
        <Form {...form}>
          <form className='grid grid-cols-2 gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Name</FormLabel>
                <FormControl><Input placeholder='Enter topic name' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='description' render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder='Provide detailed description' rows={2} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='skills' render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Requirements</FormLabel>
                <FormControl><Input placeholder='e.g., React, Node.js' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='capacity' render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Student Capacity</FormLabel>
                <FormControl><Input type='number' min='1' placeholder='Enter capacity' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='prequisite' render={({ field }) => (
              <FormItem>
                <FormLabel>Prequisite Name</FormLabel>
                <FormControl><Input placeholder="Enter prequisite's name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='duration' render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder='Select duration' /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='6 weeks'>6 weeks</SelectItem>
                    <SelectItem value='3 months'>3 months</SelectItem>
                    <SelectItem value='6 months'>6 months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='category' render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder='Select category' /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>Science</SelectItem>
                    <SelectItem value='2'>Technology</SelectItem>
                    <SelectItem value='3'>Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='campus' render={({ field }) => (
              <FormItem>
                <FormLabel>Campus</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder='Select campus' /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='65fc8e4b8b3a2a001c5f1a1d'>Hà Nội</SelectItem>
                    <SelectItem value='65fc8e4b8b3a2a001c5f0a1d'>Đà Nẵng</SelectItem>
                    <SelectItem value='65fc8e4b8b3a2a001c5f2a1d'>Cần Thơ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default TopicForm
