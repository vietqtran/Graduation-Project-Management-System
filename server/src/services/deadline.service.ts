import DeadlineModel, { IDeadline } from "@/models/deadline.model";
import ParameterModel, { IParameter } from "@/models/parameter.model";
import { Model } from "mongoose";
import { getCurrentSemester } from '../helpers/date-helper';
import { GetDeadlinesDto, UpdateDeadlineDto } from "@/dtos/deadline/deadline.dto";
import { HttpException } from "@/shared/exceptions/http.exception";
import { TokenPayload } from "@/shared/interfaces/token-payload.interface";
import { CreateParameterDto, DeleteParameterDto, UpdateParameterDto } from "@/dtos/deadline/parameter.dto";

export class DeadlineService {
    private readonly deadlineModel: Model<IDeadline>
    private readonly parameterModel: Model<IParameter>
    constructor() {
        this.deadlineModel = DeadlineModel
        this.parameterModel = ParameterModel
    }

    async getAllDeadlinesBySemester(getDeadlinesDto:GetDeadlinesDto, user: TokenPayload) {
        const semester = getDeadlinesDto?.semester || getCurrentSemester();

        let deadlines = await this.deadlineModel.find({ semester: semester });
        //check deadlines is empty

        if (deadlines.length === 0 && semester===getCurrentSemester()) {
            const newDeadlines = [
                { deadline_key: 'create_group', semester: semester, created_by: user._id, updated_by: user._id },
                { deadline_key: 'create_idea', semester: semester, created_by: user._id, updated_by: user._id },
                { deadline_key: 'thesis_defense', semester: semester, created_by: user._id, updated_by: user._id}
              ];
            deadlines = await this.deadlineModel.insertMany(newDeadlines);
            
        } 
        
        return deadlines;
    }

    async updateDeadline(updateDeadlineDto: UpdateDeadlineDto, user: TokenPayload) {
        const { semester, deadline_key, deadline_date } = updateDeadlineDto;

        const deadline = await this.deadlineModel.findOne({ semester: semester, deadline_key: deadline_key });

        if (!deadline) {
        throw new HttpException('Deadline not found', 404);
        }

        deadline.deadline_date = deadline_date;
        deadline.updated_by = user._id;
        await deadline.save();

        return deadline;
    }

    async getAllParameters() {
        const parameters = await this.parameterModel.find();
        return parameters;
    }

    async createParameter(parameter: CreateParameterDto, user: TokenPayload) {
        const newParameter = await this.parameterModel.create({
            ...parameter,
            created_by: user._id,
            updated_by: user._id
        });

        return newParameter
    }

    async updateParameter(parameter: UpdateParameterDto, user: TokenPayload) {
        const updatedParameter = await this.parameterModel.findByIdAndUpdate(
            parameter._id,
            {
                param_value: parameter.param_value,
                param_type: parameter.param_type,
                description: parameter.description ?? undefined,
                updated_by: user._id
            },
            { new: true, runValidators: true }
        );
    
        if (!updatedParameter) {
            throw new HttpException('Parameter not found', 404);
        }
    
        return updatedParameter;
    }
    async deleteParameter(parameter: DeleteParameterDto) {
        const deletedParameter = await this.parameterModel.findByIdAndDelete(parameter._id);

        if (!deletedParameter) {
            throw new HttpException('Parameter not found', 404);
        }

        return deletedParameter;
    }
    

}