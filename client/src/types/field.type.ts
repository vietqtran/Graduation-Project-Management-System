import { Major } from './major.type'
export interface Field {
  major?: Major
  _id: string
  name: string
  description?: string
  created_at?: Date
  updated_at?: Date
}
