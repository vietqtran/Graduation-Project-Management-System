import DeadlineModel, { IDeadline } from "@/models/deadline.model";
import ParameterModel, { IParameter } from "@/models/parameter.model";
import { Model } from "mongoose";
import { getCurrentSemester } from '../helpers/date-helper';
import { GetDeadlinesDto, UpdateDeadlineDto } from "@/dtos/deadline/deadline.dto";
import { HttpException } from "@/shared/exceptions/http.exception";
import { TokenPayload } from "@/shared/interfaces/token-payload.interface";
import { CreateParameterDto, DeleteParameterDto, UpdateParameterDto } from "@/dtos/deadline/parameter.dto";
import { runTransaction } from "@/helpers/transaction-helper";

export class DeadlineService {
    private readonly deadlineModel: Model<IDeadline>
    private readonly parameterModel: Model<IParameter>
    constructor() {
        this.deadlineModel = DeadlineModel
        this.parameterModel = ParameterModel
    }

    async getAllDeadlinesBySemester(getDeadlinesDto: GetDeadlinesDto, user: TokenPayload) {
        return runTransaction(async (session) => {
            const semester = getDeadlinesDto?.semester || getCurrentSemester();

            let deadlines = await this.deadlineModel
                .find({ semester })
                .populate([
                    { path: 'created_by', select: 'display_name username email' },
                    { path: 'updated_by', select: 'display_name username email' }
                ])
                .session(session);
 
            if (deadlines.length === 0 && semester === getCurrentSemester()) {
                const newDeadlines = [
                    { deadline_key: 'create_group', semester, created_by: user._id, updated_by: user._id },
                    { deadline_key: 'create_idea', semester, created_by: user._id, updated_by: user._id },
                    { deadline_key: 'thesis_defense', semester, created_by: user._id, updated_by: user._id }
                ];
                
                await this.deadlineModel.insertMany(newDeadlines, { session });
    
                deadlines = await this.deadlineModel
                    .find({ semester })
                    .populate([
                        { path: 'created_by', select: 'display_name username email' },
                        { path: 'updated_by', select: 'display_name username email' }
                    ])
                    .session(session);
            }
    
            return deadlines;
        });
    }
    
    async updateDeadline(updateDeadlineDto: UpdateDeadlineDto, user: TokenPayload) {
        return runTransaction(async (session) => {
            const { semester, deadline_key, deadline_date } = updateDeadlineDto;

            let deadline = await this.deadlineModel
                .findOne({ semester, deadline_key })
                .session(session);
    
            if (!deadline) {
                throw new HttpException('Deadline not found', 404);
            }

            deadline.deadline_date = deadline_date;
            deadline.updated_by = user._id;
    
            await deadline.save({ session });
            deadline = await deadline.populate([
                { path: 'created_by', select: 'display_name username email' },
                { path: 'updated_by', select: 'display_name username email' }
            ]);
    
            return deadline;
        });
    }
    

    async getAllParameters() {
        return runTransaction(async (session) => {
            const parameters = await this.parameterModel.find().populate([
                { path: 'created_by', select: 'display_name username email' },
                { path: 'updated_by', select: 'display_name username email' }
            ]).session(session);
            return parameters;
        });
    }

    async createParameter(parameter: CreateParameterDto, user: TokenPayload) {
        return runTransaction(async (session) => {
            const newParameter = await this.parameterModel.create([{
                ...parameter,
                created_by: user._id,
                updated_by: user._id
            }], { session });
    
            return newParameter[0].populate([ //nếu dùng transaction thì create() tạo về 1 mảng
                { path: 'created_by', select: 'display_name username email' },
                { path: 'updated_by', select: 'display_name username email' }
            ]);
        });
    }
    

    async updateParameter(parameter: UpdateParameterDto, user: TokenPayload) {
        return runTransaction(async (session) => {
            const updatedParameter = await this.parameterModel
                .findByIdAndUpdate(
                    parameter._id,
                    {
                        param_value: parameter.param_value,
                        param_type: parameter.param_type,
                        description: parameter.description ?? undefined,
                        updated_by: user._id
                    },
                    { new: true, runValidators: true, session }
                )
                .populate([
                    { path: 'created_by', select: 'display_name username email' },
                    { path: 'updated_by', select: 'display_name username email' }
                ]);
    
            if (!updatedParameter) {
                throw new HttpException('Parameter not found', 404);
            }
    
            return updatedParameter;
        });
    }
    
    async deleteParameter(parameter: DeleteParameterDto) {
        return runTransaction(async (session) => {
            const deletedParameter = await this.parameterModel.findByIdAndDelete(parameter._id, { session });
    
            if (!deletedParameter) {
                throw new HttpException('Parameter not found', 404);
            }
        });
    }
    

}