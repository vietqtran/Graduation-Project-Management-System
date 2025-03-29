'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import instance from '@/utils/axios'
import { useAuth } from '@/hooks/useAuth'

interface User {
  id: string
  display_name: string
  email: string
  roles: string[]  
}

const DefenseNotification = () => {
  const { me } = useAuth()
  const [isPassed, setIsPassed] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await me()
      setCurrentUser(user)
    }
    fetchUser()
  }, [me])

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const response = await instance.get('/request/check-eligibility', { withCredentials: true })
        setIsPassed(response.data.data)
      } catch (error) {
        console.error('API Error:', error)
        toast.error('Lỗi khi kiểm tra điều kiện bảo vệ!')
        setIsPassed(false)
      }
    }

    fetchEligibility()
  }, [])

  const isSupervisor = currentUser?.roles?.includes('supervisor')
  console.log(isSupervisor)

  if (isPassed === null || !currentUser) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <Card className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-lg border border-gray-300 bg-white'>
          <CardHeader className='text-center'>
            <div className='flex flex-col items-center justify-center mt-10'>
              <Image
                src='/gif/opinions.gif'
                alt='Status icon'
                width={100}
                height={100}
              />
            </div>
            <CardTitle className='text-xl font-semibold mt-4'>Keep working on your project!</CardTitle>
          </CardHeader>
          <CardContent className='text-center text-gray-600'>
            {currentUser ? (
              <p>Xin chào {currentUser.display_name}, tiếp tục học tập và áp dụng những gì bạn đã học.</p>
            ) : (
              <p>Continue learning and applying what you have learned.</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center h-screen w-screen-full'>
      <Card className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-none border border-gray-300 bg-white'>
        <CardHeader className='text-center'>
          <div className='flex flex-col items-center justify-center mt-10'>
            <Image
              src={isSupervisor ? '/gif/shield.gif' : isPassed ? '/gif/shield.gif' : '/gif/shield-failed.gif'}
              alt='Status icon'
              width={100}
              height={100}
            />
          </div>
          <CardTitle className='text-xl font-semibold mt-4'>
            {isSupervisor ? 'Chúc mừng bạn!' : isPassed ? 'Chúc mừng bạn!' : 'Rất tiếc!'}
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center text-gray-600'>
          {isSupervisor ? (
            <>
              <p>{currentUser.display_name}, bạn đã hoàn thành hướng dẫn đồ án.</p>
              <p>Cảm ơn bạn đã hỗ trợ sinh viên trong quá trình thực hiện đồ án.</p>
            </>
          ) : isPassed ? (
            <>
              <p>{currentUser.display_name}, bạn đã đủ điều kiện để bảo vệ đồ án.</p>
              <p>Vui lòng kiểm tra lịch trình và chuẩn bị tốt nhất cho buổi bảo vệ.</p>
            </>
          ) : (
            <>
              <p>{currentUser.display_name}, bạn đã không đủ điều kiện để bảo vệ đồ án tốt nghiệp.</p>
              <p>Vui lòng kiểm tra lại yêu cầu và chuẩn bị cho kỳ bảo vệ sau.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DefenseNotification