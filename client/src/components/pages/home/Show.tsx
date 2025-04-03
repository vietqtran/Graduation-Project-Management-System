'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import instance from '@/utils/axios'
import { useAuth } from '@/hooks/useAuth'

interface User {
  _id: string
  email: string
  username: string
  first_name: string
  display_name: string
  last_name: string
  avatar: string
  roles: string[]
  status: number
  code: string
  field: string[]
  major: string[]
  planned_semester: string
  created_at: string
  updated_at: string
  project: string
}

interface Project {
  _id: string
  members: string[]
}

interface Deadline {
  deadline_key: string
  deadline_date: string
}

const DefenseNotification = () => {
  const { me } = useAuth()
  const [isPassed, setIsPassed] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isBeforeDeadline, setIsBeforeDeadline] = useState<boolean>(true)
  const [project, setProject] = useState<Project | null>(null)
  const [deadlines, setDeadlines] = useState<Deadline[] | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await me()
      setCurrentUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const response = await instance.get('/request/check-eligibility', { withCredentials: true })
        setIsPassed(response.data.data)
      } catch (error) {
        console.error('Eligibility fetch error:', error)
        toast.error('Lỗi khi kiểm tra điều kiện bảo vệ!')
        setIsPassed(false)
      }
    }

    const fetchDeadlines = async () => {
      if (!currentUser?.planned_semester) return // Không fetch nếu chưa có planned_semester

      try {
        const payload = { semester: currentUser.planned_semester }
        const response = await instance.post('/deadline/getAll', payload, { withCredentials: true })
        const deadlineData = response.data.data as Deadline[]
        setDeadlines(deadlineData)

        const currentDate = new Date()
        const thesisDefence = deadlineData.find((d) => d.deadline_key === 'thesis_defense') // Sửa thành thesis_defence
        const thesisDefenceDate = thesisDefence ? new Date(thesisDefence.deadline_date) : null
        setIsBeforeDeadline(thesisDefenceDate ? currentDate < thesisDefenceDate : true)
      } catch (error) {
        console.error('Deadlines fetch error:', error)
        setIsBeforeDeadline(true)
      }
    }

    const fetchProject = async () => {
      if (currentUser?.project) {
        try {
          const response = await instance.get(`/project/get-all`, { withCredentials: true })
          setProject(response.data)
        } catch (error) {
          console.error('Project fetch error:', error)
        }
      }
    }

    fetchEligibility()
    fetchDeadlines()
    fetchProject()
  }, [])

  const isSupervisor = currentUser?.roles?.includes('supervisor')
  const isStaff = currentUser?.roles?.includes('staff')
  const isStudent = currentUser && !isSupervisor && !isStaff
  const isInProject = project?.members?.includes(currentUser?._id || '')
  const thesisDefence = deadlines?.find((d) => d.deadline_key === 'thesis_defence')
  const daysToDeadline =
    thesisDefence && isBeforeDeadline
      ? Math.ceil((new Date(thesisDefence.deadline_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      : null
  const isNearDeadline = daysToDeadline !== null && daysToDeadline <= 7

  console.log({
    isSupervisor,
    isStaff,
    isStudent,
    isInProject,
    isBeforeDeadline,
    isPassed,
    daysToDeadline,
    isNearDeadline,
  })

  // Nếu chưa fetch được dữ liệu cần thiết
  if (isPassed === null || !currentUser || !deadlines) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <Card className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-lg border border-gray-300 bg-white'>
          <CardHeader className='text-center'>
            <div className='flex flex-col items-center justify-center mt-10'>
              <Image
                src={currentUser ? '/gif/will.gif' : '/gif/no-data.gif'}
                alt='Loading icon'
                width={100}
                height={100}
              />
            </div>
            <CardTitle className='text-xl font-semibold mt-4'>Đang tải thông tin...</CardTitle>
          </CardHeader>
          <CardContent className='text-center text-gray-600'>
            {currentUser ? (
              <p>Xin chào {currentUser.display_name}, hệ thống đang tải dữ liệu của bạn.</p>
            ) : (
              <p>Vui lòng đợi trong giây lát để kiểm tra trạng thái.</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Khi đã có tất cả dữ liệu
  return (
    <div className='flex items-center justify-center h-screen w-screen-full'>
      <Card className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-none border border-gray-300 bg-white'>
        <CardHeader className='text-center'>
          <div className='flex flex-col items-center justify-center mt-10'>
            <Image
              src={
                isBeforeDeadline && isSupervisor
                  ? '/gif/growth.gif'
                  : isBeforeDeadline && isStaff
                  ? '/gif/progress.gif'
                  : isBeforeDeadline && isStudent && !isInProject
                  ? '/gif/speech-bubble.gif'
                  : isBeforeDeadline && isStudent && isInProject && isNearDeadline
                  ? '/gif/opinions.gif'
                  : isBeforeDeadline && isStudent && isInProject
                  ? '/gif/progress.gif'
                  : isSupervisor
                  ? '/gif/new-job.gif'
                  : isStaff
                  ? '/gif/shield.gif'
                  : isPassed
                  ? '/gif/shield.gif'
                  : '/gif/shield-failed.gif'
              }
              alt='Status icon'
              width={100}
              height={100}
            />
          </div>
          <CardTitle className='text-xl font-semibold mt-4'>
            {isBeforeDeadline && (isSupervisor || isStaff || isStudent)
              ? 'Đang thực hiện'
              : isSupervisor || isStaff || isPassed
              ? 'Chúc mừng bạn!'
              : 'Rất tiếc!'}
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center text-gray-600'>
          {isBeforeDeadline && isSupervisor ? (
            <>
              <p>{currentUser.display_name}, bạn đang là giảng viên hướng dẫn đồ án.</p>
              <p>Vui lòng tiếp tục hỗ trợ sinh viên hoàn thành dự án đúng hạn.</p>
            </>
          ) : isBeforeDeadline && isStaff ? (
            <>
              <p>{currentUser.display_name}, bạn đang là cán bộ hỗ trợ và giúp đỡ sinh viên làm đồ án.</p>
              <p>Cảm ơn bạn đã đồng hành cùng sinh viên trong quá trình này.</p>
            </>
          ) : isBeforeDeadline && isStudent && !isInProject ? (
            <>
              <p>{currentUser.display_name}, hãy tìm nhóm để bắt đầu làm đồ án.</p>
              <p>Liên hệ với giảng viên hoặc cán bộ để được hỗ trợ tìm nhóm.</p>
            </>
          ) : isBeforeDeadline && isStudent && isInProject ? (
            <>
              <p>{currentUser.display_name}, hãy tiếp tục làm đồ án.</p>
              <p>Hoàn thành công việc đúng hạn để chuẩn bị cho buổi bảo vệ.</p>
              {isNearDeadline && (
                <p className='text-red-500'>Cảnh báo: Còn {daysToDeadline} ngày đến hạn bảo vệ!</p>
              )}
            </>
          ) : isSupervisor ? (
            <>
              <p>{currentUser.display_name}, bạn đã hoàn thành hướng dẫn đồ án.</p>
              <p>Cảm ơn bạn đã hỗ trợ sinh viên trong quá trình thực hiện đồ án.</p>
            </>
          ) : isStaff ? (
            <>
              <p>{currentUser.display_name}, cảm ơn cán bộ đã hoạt động.</p>
              <p>Sự hỗ trợ của bạn rất quan trọng cho sự thành công của chương trình.</p>
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