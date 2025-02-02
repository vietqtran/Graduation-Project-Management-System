import DeadlineModel, { IDeadline } from "@/models/deadline.model";
import ParameterModel, { IParameter } from "@/models/parameter.model";
import { Model } from "mongoose";
import { getCurrentSemester } from '../helpers/date-helper';
import { GetDeadlinesDto, UpdateDeadlineDto } from "@/dtos/deadline/deadline.dto";
import { HttpException } from "@/shared/exceptions/http.exception";

export class DeadlineService {
    private readonly deadlineModel: Model<IDeadline>
    private readonly parameterModel: Model<IParameter>
    constructor() {
        this.deadlineModel = DeadlineModel
        this.parameterModel = ParameterModel
    }

    async getAllDeadlinesBySemester(getDeadlinesDto:GetDeadlinesDto) {
        const semester = getDeadlinesDto?.semester || getCurrentSemester();

        let deadlines = await this.deadlineModel.find({ semester: semester });
        //check deadlines is empty

        if (deadlines.length === 0) {
            const newDeadlines = [
                { deadline_key: 'create_group', semester: semester, created_by: 'user_id', updated_by: 'user_id' },
                { deadline_key: 'create_idea', semester: semester, created_by: 'user_id', updated_by: 'user_id' },
                { deadline_key: 'thesis_defense', semester: semester, created_by: 'user_id', updated_by: 'user_id'}
              ];
            deadlines = await this.deadlineModel.insertMany(newDeadlines);
            
        } 
        
        return deadlines;
    }

    async updateDeadline(updateDeadlineDto: UpdateDeadlineDto) {
    const { semester, deadline_key, deadline_date } = updateDeadlineDto;

    const deadline = await this.deadlineModel.findOne({ semester: semester, deadline_key: deadline_key });

    if (!deadline) {
      throw new HttpException('Deadline not found', 404);
    }

    deadline.deadline_date = deadline_date;
    deadline.updated_by = 'user_id';
    await deadline.save();

    return deadline;
    }



}