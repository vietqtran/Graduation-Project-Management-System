'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import GithubLoginButton from '../ui/GithubLoginButton'
import GoogleLoginButton from '../ui/GoogleLoginButton'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks'
import { useForm } from 'react-hook-form'
import { useRouter } from '@/hooks/useRouter'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z
  .object({
    email: z.string().min(1, 'Email is required.').email('Invalid email.').max(255, 'Email is too long.'),
    first_name: z.string().min(1, 'First name is required.').max(50, 'First name is too long.'),
    last_name: z.string().min(1, 'Last name is required.').max(50, 'Last name is too long.'),
    password: z
      .string()
      .min(1, 'Password is required.')
      .min(8, 'Password is too short. Minimum length is 8 characters.')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one letter and one number.'
      }),
    confirm_password: z.string().min(1, 'Confirm password is required.')
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password']
  })

const SignUpForm = () => {
  const { signUp, googleSignUp } = useAuth()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password, first_name, last_name } = values
    startTransition(async () => {
      const user = await signUp({
        email,
        password,
        first_name,
        last_name
      })
      if (user) {
        replace('/')
      }
    })
  }

  return (
    <div className='w-full max-w-lg space-y-4 rounded-lg p-5'>
      <div className='pt-3 text-left'>
        <h1 className='mb-2 text-2xl font-bold'>Sign Up</h1>
        <p className='text-sm text-muted-foreground'>Create an account to continue</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-3'>
          <div className='flex w-full items-start justify-between gap-2'>
            <FormField
              control={form.control}
              name='first_name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input className='w-full focus:ring-2' placeholder='John' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='last_name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input className='focus:ring-2' placeholder='Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className='focus:ring-2' placeholder='example@domain.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='focus:ring-2' placeholder='••••••••' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type='password' className='focus:ring-2' placeholder='••••••••' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='w-full pt-4'>
            <Button
              loading={isPending}
              className='w-full bg-blue-500 font-semibold hover:bg-blue-600 dark:text-white'
              type='submit'
            >
              Sign up
            </Button>
          </div>
        </form>
      </Form>

      <div className='flex w-full items-center gap-2'>
        <span className='h-[1px] flex-1 border-b'></span>
        <span className='text-xs text-muted-foreground'>or</span>
        <span className='h-[1px] flex-1 border-b'></span>
      </div>

      <div className='flex flex-col gap-3 md:flex-row'>
        <GoogleLoginButton callback={googleSignUp} />
        <GithubLoginButton />
      </div>

      <div className='pb-5 pt-4'>
        <p data-cy='switch-to-sign-in' className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <a
            data-cy='sign-in-link'
            href='/auth/sign-in'
            className='font-semibold text-blue-500 underline hover:text-blue-600'
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpForm
