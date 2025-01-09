/* eslint-disable @typescript-eslint/no-explicit-any */

import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

import axios from '@/utils/axios'
import { setUser } from '@/store/slices/auth.slice'
import { toast } from 'sonner'
import { useAppDispatch } from './useStore'
import { useDevice } from './useDevice'
import { v4 as uuidv4 } from 'uuid'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { getDeviceInformation } = useDevice()

  const signUp = async ({
    email,
    password,
    first_name,
    last_name
  }: {
    email: string
    password: string
    first_name: string
    last_name: string
  }) => {
    try {
      const username = email.split('@')[0]
      const device_id = uuidv4()
      const device = JSON.stringify(getDeviceInformation())
      const payload = { email, password, username, first_name, last_name, device_id, device }
      const response = await axios.post(
        '/auth/sign-up',
        { ...payload },
        {
          withCredentials: true
        }
      )
      const { data } = response
      if (data && data?.success === true) {
        dispatch(
          setUser({
            user: data?.data?.user
          })
        )
        if (data?.data?.deviceId) {
          localStorage.setItem('device_id', data?.data?.deviceId)
        }
        return data?.data?.user
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const device_id = localStorage.getItem('device_id') ?? uuidv4()
    const device = JSON.stringify(getDeviceInformation())
    try {
      const response = await axios.post(
        '/auth/sign-in',
        { email, password, device_id, device },
        {
          withCredentials: true
        }
      )
      const { data } = response
      if (data && data?.success === true) {
        dispatch(
          setUser({
            user: data?.data?.user
          })
        )
        if (data?.data?.deviceId) {
          localStorage.setItem('device_id', data?.data?.deviceId)
        }
        return data?.data?.user
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const me = async () => {
    try {
      const response = await axios.get('/auth/me', { withCredentials: true })
      const { data } = response
      if (data && data?.success === true) {
        dispatch(
          setUser({
            user: data?.data
          })
        )
        return data?.data
      }
      return null
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const logOut = async () => {
    try {
      await axios.post('/auth/log-out', {}, { withCredentials: true })
      dispatch(
        setUser({
          user: null
        })
      )
      localStorage.removeItem('device_id')
    } catch (error) {
      console.log(error)
    }
  }

  const registerPasskey = async () => {
    try {
      const response = await axios.get('/auth/passkey/registration', { withCredentials: true })
      const { data } = response
      if (!(data && data?.success === true)) {
        return null
      }
      const optionsJSON = data?.data ?? {}
      const attResp = await startRegistration({ optionsJSON })
      const verificationResp = await axios.post(
        '/auth/passkey/registration',
        {
          response: attResp,
          challenge: optionsJSON.challenge
        },
        {
          withCredentials: true
        }
      )
      const { data: verifyData } = verificationResp
      if (verifyData && verifyData?.success === true) {
        dispatch(
          setUser({
            user: verifyData?.data?.user
          })
        )
        if (verifyData?.data?.deviceId) {
          localStorage.setItem('device_id', verifyData?.data?.deviceId)
        }
        return verifyData?.data?.user
      }
      return verificationResp
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const verifyPasskey = async (email: string) => {
    try {
      const response = await axios.get(`/auth/passkey/verify?email=${email}`, { withCredentials: true })
      const { data } = response
      if (!(data && data?.success === true)) {
        return
      }
      const optionsJSON = data?.data ?? {}
      const attResp = await startAuthentication({ optionsJSON })
      const verificationResp = await axios.post(
        '/auth/passkey/verify-login',
        {
          device_id: localStorage.getItem('device_id') ?? uuidv4(),
          device: JSON.stringify(getDeviceInformation()),
          email,
          response: attResp,
          challenge: optionsJSON.challenge
        },
        {
          withCredentials: true
        }
      )
      return verificationResp
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return
    }
  }

  return { signUp, signIn, me, logOut, registerPasskey, verifyPasskey }
}
