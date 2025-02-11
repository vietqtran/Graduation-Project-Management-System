import { RootState } from '@/types/store.type'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import { useAppSelector } from './useStore'

export const useUpload = () => {
  const { user } = useAppSelector((state: RootState) => state.auth)

  async function upload(fileList: FileList | null) {
    if (!fileList) return
    try {
      const files = []
      for (const element of fileList) {
        const file = element
        files.push({
          originalName: file.name,
          contentType: file.type,
          size: file.size
        })
      }

      const { data } = await instance.post(
        '/upload/presigned-urls',
        {
          files,
          currentDateTime: new Date().toISOString(),
          userLogin: user?.username ?? 'unknown'
        },
        { withCredentials: true }
      )

      const uploadPromises = Array.from(fileList).map(async (file, index) => {
        const presignedUrlData = data.data[index]
        try {
          const uploadResponse = await fetch(presignedUrlData.presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type
            }
          })

          if (!uploadResponse.ok) {
            toast.error('File upload failed!')
            return {
              success: false,
              results: null
            }
          }

          return {
            originalName: file.name,
            key: presignedUrlData.key,
            success: true
          }
        } catch (error) {
          console.error('Error in uploadMultipleFiles:', error)
          toast.error('File upload failed!')
        }
      })

      const results = await Promise.all(uploadPromises)

      return {
        success: true,
        results
      }
    } catch (error) {
      console.error('Error in uploadMultipleFiles:', error)
      return {
        success: false,
        results: null
      }
    }
  }

  return { upload }
}
