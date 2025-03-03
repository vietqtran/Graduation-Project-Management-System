'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'

interface TopicFormProps {
  onSubmit: (data: { name: string; description: string; major: string; field: string; document: string; campus: string; category: string; supervisor: string; }) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      major: '',
      field: '',
      document: '',
      campus: '',
      category: '',
      supervisor: '',
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
            <FormControl><Input type='text' placeholder='Enter topic name' {...field} /></FormControl>
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

        <FormField control={form.control} name='major' render={({ field }) => (
          <FormItem>
            <FormLabel>Majors</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder='Select major' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='67a8ecd0d1eb085255e86f21'>HE</SelectItem>
                <SelectItem value='67a8ecf3d1eb085255e86f23'>HS</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name='field' render={({ field }) => (
          <FormItem>
            <FormLabel>Field</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder='Select field' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='67a8ec0fd1eb085255e86f1d'>Software Engineering</SelectItem>
                <SelectItem value='67a8ec7dd1eb085255e86f20'>Artificial Intelligence</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name='document' render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Document</FormLabel>
            <FormControl>
              <Input type='file' onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name='campus' render={({ field }) => (
          <FormItem>
            <FormLabel>Campus</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder='Select campus' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='67a8eea9d1eb085255e86f2a'>Hòa Lạc</SelectItem>
                <SelectItem value='67b6028c8d133eec2f0c2415'>TP Hồ Chí Minh</SelectItem>
                <SelectItem value='67b602318d133eec2f0c2413'>Đà Nẵng</SelectItem>
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
                <SelectItem value='1'>From Student</SelectItem>
                <SelectItem value='2'>From Teacher</SelectItem>
                <SelectItem value='3'>From School</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

       <FormItem>
        <FormLabel>Supervisor</FormLabel>
        <Select value='supervisor' disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select supervisor" />
          </SelectTrigger>
        </Select>
        <FormMessage />
      </FormItem>
      </form>
    </Form>
  </div>
</div>

  )
}

export default TopicForm
