'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import GoogleLoginButton from '../ui/GoogleLoginButton'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks'
import { useForm } from 'react-hook-form'
import { useRouter } from '@/hooks/useRouter'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Invalid email.').max(255, 'Email is too long.'),
  password: z.string().min(1, 'Password is required.').min(6, 'Password is too short. Minimum length is 6 characters.')
})

const SignInForm = () => {
  const [isPending, startTransition] = useTransition()
  const { signIn, googleSignIn } = useAuth()
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
    <div className='w-full max-w-lg space-y-4 rounded-lg p-5' data-cy='signin-container'>
      <div className='pt-3 text-left'>
        <h1 className='mb-2 text-2xl font-bold' data-cy='signin-title'>
          Sign In
        </h1>
        <p className='text-sm text-muted-foreground' data-cy='signin-subtitle'>
          Sign in if you already have an account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3' data-cy='signin-form'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='email-input'>Email</FormLabel>
                <FormControl>
                  <Input id='email-input' data-cy='email-input' placeholder='email@example.com' {...field} />
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
                <FormLabel htmlFor='password-input'>Password</FormLabel>
                <FormControl>
                  <Input
                    id='password-input'
                    data-cy='password-input'
                    type='password'
                    placeholder='********'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex items-center justify-between'>
            <Button
              loading={isPending}
              data-cy='signin-button'
              className='w-full bg-blue-500 font-semibold hover:bg-blue-600'
              type='submit'
            >
              Sign in
            </Button>
          </div>
        </form>
      </Form>

      <div className='flex w-full items-center gap-3'>
        <span className='h-[1px] flex-1 border-b' />
        <span className='text-sm text-muted-foreground'>or</span>
        <span className='h-[1px] flex-1 border-b'></span>
      </div>

      <div className='flex flex-col gap-3 md:flex-row'>
        <GoogleLoginButton callback={googleSignIn} />
      </div>
    </div>
  )
}

export default SignInForm
