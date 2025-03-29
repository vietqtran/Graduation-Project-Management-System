import mongoose, { Document, Model, Schema } from 'mongoose'
import { IMajor } from './major.model'
export interface IField extends Document {
  name: string
  description: string
  major: IMajor['_id']
}

export const FieldSchema = new Schema<IField>(
  {
    name: {
      type: String,
      required: [true, 'Field name is required'],
      trim: true,
      minlength: [2, 'Field name must be at least 2 characters'],
      maxlength: [100, 'Field name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    major: {
      type: Schema.Types.ObjectId,
      ref: 'Major'
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

const FieldModel: Model<IField> = mongoose.model<IField>('Field', FieldSchema)
export default FieldModel
