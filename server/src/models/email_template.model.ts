import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IEmailTemplate extends Document {
  title: string
  content: string
  detail_content: string
  type: string
  send_type: string
  remark: string
  active: boolean
  params: Object
}

export const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters']
    },
    detail_content: {
      type: String,
      minlength: [10, 'Detail content must be at least 10 characters']
    },
    type: {
      type: String,
      required: [true, 'Template type is required'],
      enum: {
        values: ['notification', 'reminder', 'welcome', 'verification', 'reset-password'],
        message: '{VALUE} is not a valid template type'
      }
    },
    send_type: {
      type: String,
      enum: {
        values: ['immediate', 'scheduled', 'trigger'],
        message: '{VALUE} is not a valid send type'
      },
      default: 'immediate'
    },
    remark: {
      type: String,
      trim: true,
      maxlength: [500, 'Remark cannot exceed 500 characters']
    },
    active: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false
  }
)

const EmailTemplateModel: Model<IEmailTemplate> = mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema)
export default EmailTemplateModel
