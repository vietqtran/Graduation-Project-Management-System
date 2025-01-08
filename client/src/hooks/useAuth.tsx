import axios from '@/utils/axios'
import { setUser } from '@/store/slices/auth.slice'
import { useAppDispatch } from './useStore'
import { useDevice } from './useDecvice'
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
      const { data } = await axios.post(
        '/auth/sign-up',
        { ...payload },
        {
          withCredentials: true
        }
      )
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
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const device_id = localStorage.getItem('device_id') ?? uuidv4()
    const device = JSON.stringify(getDeviceInformation())
    try {
      const { data } = await axios.post(
        '/auth/sign-in',
        { email, password, device_id, device },
        {
          withCredentials: true
        }
      )
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
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const me = async () => {
    try {
      const { data } = await axios.get('/auth/me', { withCredentials: true })
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

  return { signUp, signIn, me, logOut }
}
