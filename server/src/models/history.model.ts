import mongoose, { Document, Mixed, Model, Schema } from 'mongoose'

export interface IHistory extends Document {
  old: Mixed
  new: Mixed
  type: string
}

export const HistorySchema = new Schema<IHistory>(
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

const HistoryModel: Model<IHistory> = mongoose.model<IHistory>('History', HistorySchema)
export default HistoryModel
