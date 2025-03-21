'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import GithubLoginButton from '../ui/GithubLoginButton'
import GoogleLoginButton from '../ui/GoogleLoginButton'
import { Input } from '@/components/ui/input'
import { LineMdLoadingLoop } from '@/components/icons/Loading'
import Passkey from '@/components/icons/Passkey'
import { toast } from 'sonner'
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
  const [isPendingPasskey, startTransitionPasskey] = useTransition()
  const { signIn, verifyPasskey, googleSignIn } = useAuth()
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

  const handleLoginByPasskey = async () => {
    startTransitionPasskey(async () => {
      const email = form.getValues('email')
      if (form.formState.errors.email) {
        toast.error(form.formState.errors.email.message)
        form.setError('email', {
          message: form.formState.errors.email.message
        })
        form.clearErrors('password')
        document.getElementById('email-input')?.focus()
        return
      }
      form.clearErrors('password')
      const user = await verifyPasskey(email)
      if (user) {
        replace('/')
      } else {
        document.getElementById('email-input')?.focus()
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
            <div>
              <Button
                loading={isPending}
                data-cy='signin-button'
                className='w-full bg-blue-500 font-semibold hover:bg-blue-600 dark:text-white'
                type='submit'
              >
                Sign in
              </Button>
            </div>
            <div className='pl-3'>
              <Button
                data-cy='passkey-button'
                onClick={handleLoginByPasskey}
                type='button'
                className='grid place-items-center bg-transparent dark:bg-neutral-100 hover:bg-neutral-300 aspect-square relative'
              >
                <span className='absolute top-1/2 left-1/2 text-black -translate-x-1/2 -translate-y-1/2 z-10'>
                  {isPendingPasskey ? <LineMdLoadingLoop stroke='black' /> : <Passkey fill='black' />}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className='flex w-full items-center gap-3'>
        <span className='h-[1px] flex-1 border-b'></span>
        <span className='text-sm text-muted-foreground'>or</span>
        <span className='h-[1px] flex-1 border-b'></span>
      </div>

      <div className='flex flex-col gap-3 md:flex-row'>
        <GoogleLoginButton callback={googleSignIn} />
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
