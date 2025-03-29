'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

import Image from 'next/image'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'

export default function DefenseNotification() {
  const [isPassed, setIsPassed] = useState<boolean | null>(null)
  const {user} = useAppSelector((state) => state.auth)
  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const { data } = await instance.get('/request/check-eligibility', { withCredentials: true })
        setIsPassed(data.data)
      } catch (error) {
        console.error('API Error:', error)
        toast.error('Lỗi khi kiểm tra điều kiện bảo vệ!')
        setIsPassed(false)
      }
    }

    fetchEligibility()
  }, [])

  if (!user?.roles.includes('student')) {
    return null
  } else {


    return (
      <div className='flex items-center justify-center h-screen w-screen-full'>
        <Card className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-none border border-gray-300 bg-white'>
          <CardHeader className='text-center'>
            <div className='flex flex-col items-center justify-center mt-10'>
              <Image
                src={isPassed ? '/gif/shield.gif' : '/gif/shield-failed.gif'}
                alt='Status icon'
                width={100}
                height={100}
              />
            </div>
            <CardTitle className='text-xl font-semibold mt-4'>{isPassed ? 'Chúc mừng bạn!' : 'Rất tiếc!'}</CardTitle>
          </CardHeader>
          <CardContent className='text-center text-gray-600'>
            {isPassed ? (
              <>
                <p>Bạn đã đủ điều kiện để bảo vệ đồ án.</p>
                <p>Vui lòng kiểm tra lịch trình và chuẩn bị tốt nhất cho buổi bảo vệ.</p>
              </>
            ) : (
              <>
                <p>Bạn đã không đủ điều kiện để bảo vệ đồ án tốt nghiệp.</p>
                <p>Vui lòng kiểm tra lại yêu cầu và chuẩn bị cho kỳ bảo vệ sau.</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
}
