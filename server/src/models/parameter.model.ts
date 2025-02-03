import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './user.model'

export interface IParameter extends Document {
  param_name: string
  param_value: string
  param_type: string
  description: string
  created_by: IUser['_id']
  updated_by: IUser['_id']
}

export const ParameterSchema = new Schema<IParameter>(
  {
    param_name: {
      type: String,
      required: [true, 'Parameter name is required'],
      trim: true,
      unique: true
    },
    param_value: {
      type: String,
      required: [true, 'Parameter value is required']
    },
    param_type: {
      type: String,
      required: [true, 'Parameter type is required'],
      enum: {
        values: ['string', 'number', 'boolean', 'date', 'object'],
        message: '{VALUE} is not a valid parameter type'
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created user is required']
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Updated user is required']
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false
  },
  
)

const ParameterModel: Model<IParameter> = mongoose.model<IParameter>('Parameter', ParameterSchema)
export default ParameterModel
