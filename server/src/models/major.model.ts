import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IMajor extends Document {
  name: string
  description: string
}

export const MajorSchema = new Schema<IMajor>(
  {
    name: {
      type: String,
      required: [true, 'Major name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Major name must be at least 2 characters'],
      maxlength: [100, 'Major name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
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

const MajorModel: Model<IMajor> = mongoose.model<IMajor>('Major', MajorSchema)
export default MajorModel
