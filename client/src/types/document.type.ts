export interface UploadDocument {
  _id: string
  title: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  user: {
    _id: string
    username: string
    avatar: string
    display_name: string
  }
  project_id: string
  created_at: string
  updated_at: string
}
