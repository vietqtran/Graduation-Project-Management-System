import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICampus extends Document {
  name: string
  description: string
}

export const CampusSchema = new Schema<ICampus>(
  {
    name: {
      type: String,
      required: [true, 'Campus name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Campus name must be at least 2 characters'],
      maxlength: [100, 'Campus name cannot exceed 100 characters']
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

const CampusModel: Model<ICampus> = mongoose.model<ICampus>('Campus', CampusSchema)
export default CampusModel
