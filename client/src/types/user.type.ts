import { Field } from './field.type'
import { Major } from './major.type'

export interface User {
  _id: string
  email: string
  username: string
  first_name: string
  last_name: string
  roles: string[]
  avatar?: string
  display_name?: string
  major?: Major[]
  field?: Field[]
}
