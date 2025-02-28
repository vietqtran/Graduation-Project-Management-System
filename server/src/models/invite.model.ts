import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './user.model'
import { IProject } from './project.model'

export interface IInvite extends Document {
    from_user: IUser['_id']
    to_user: IUser['_id'],
    project: IProject['_id'],
    status: string,
}
export const InviteSchema = new Schema<IInvite>(
    {
        from_user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Sender user is required']
        },
        to_user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Recipient user is required']
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Project is required']
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        versionKey: false
    }
)
const InviteModel: Model<IInvite> = mongoose.model<IInvite>('Invite', InviteSchema)
export default InviteModel