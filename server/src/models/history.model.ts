import mongoose, { Document, Mixed, Model, Schema } from 'mongoose'

export interface ICampus extends Document {
  old: Mixed
  new: Mixed
  type: string
}

export const CampusSchema = new Schema<ICampus>(
  {
    old: {
      type: Schema.Types.Mixed,
      required: [true, 'Old value is required']
    },
    new: {
      type: Schema.Types.Mixed,
      required: [true, 'New value is required']
    },
    type: {
      type: String,
      required: [true, 'History type is required'],
      enum: {
        values: ['create', 'update', 'delete', 'status-change'],
        message: '{VALUE} is not a valid history type'
      }
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
