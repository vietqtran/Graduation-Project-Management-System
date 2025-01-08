'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import GithubLoginButton from '../ui/GithubLoginButton'
import GoogleLoginButton from '../ui/GoogleLoginButton'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { useRouter } from '@/hooks/useRouter'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Invalid email.').max(255, 'Email is too long.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password is too short. Minimum length is 8 characters.')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Password must contain at least one letter and one number.'
    })
})

const SignInForm = () => {
  const [isPending, startTransition] = useTransition()
  const { signIn } = useAuth()
  const { replace } = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { email, password } = values
      const user = await signIn({ email, password })
      if (user) {
        replace('/')
      }
    })
  }

  return (
    <div className='w-full max-w-lg space-y-4 rounded-lg p-5'>
      <div className='pt-3 text-left'>
        <h1 className='mb-2 text-2xl font-bold'>Sign In</h1>
        <p className='text-sm text-muted-foreground'>Sign in if you already have an account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
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

          <div className='w-full pt-4'>
            <Button
              loading={isPending}
              className='w-full bg-blue-500 font-semibold hover:bg-blue-600 dark:text-white'
              type='submit'
            >
              Sign in
            </Button>
          </div>
        </form>
      </Form>

      <div className='flex w-full items-center gap-3'>
        <span className='h-[1px] flex-1 border-b'></span>
        <span className='text-sm text-muted-foreground'>or</span>
        <span className='h-[1px] flex-1 border-b'></span>
      </div>

      <div className='flex flex-col gap-3 md:flex-row'>
        <GoogleLoginButton />
        <GithubLoginButton />
      </div>

      <div className='pb-5 pt-4'>
        <p data-cy='switch-to-sign-up' className='text-center text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <a
            data-cy='sign-up-link'
            href='/auth/sign-up'
            className='font-semibold text-blue-500 underline hover:text-blue-600'
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignInForm
