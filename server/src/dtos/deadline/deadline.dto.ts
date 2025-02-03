import { semesterRegex } from "@/constants/regex"
import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsString, Matches } from "class-validator"


export class GetDeadlinesDto {
    @IsNotEmpty({ message: 'Semester is required' })
    @Matches(semesterRegex, { message: 'Semester format is invalid' })
    semester: string;
}

export class UpdateDeadlineDto {
    @IsNotEmpty({ message: 'Deadline key is required' })
    @IsString({ message: 'Deadline key must be a string' })
    deadline_key: string;

    @IsNotEmpty({ message: 'Deadline date is required' })
    @Type(() => Date) // Chuyển đổi thành Date object
    @IsDate({ message: 'Invalid deadline date format' })
    deadline_date: Date;

    @IsNotEmpty({ message: 'Semester is required' })
    @Matches(semesterRegex, { message: 'Semester format is invalid' })
    semester: string;
}

// export class UpdateDeadlineDto {
//     @IsNotEmpty({ message: 'Deadline key is required' })
//     @IsString({ message: 'Deadline key must be a string' })
//     deadline_key: string;

//     @IsNotEmpty({ message: 'Deadline date is required' })
//     @Type(() => Date) // Chuyển đổi thành Date object
//     @IsDate({ message: 'Invalid deadline date format' })
//     deadline_date: Date;

//     @IsNotEmpty({ message: 'Semester is required' })
//     @Matches(semesterRegex, { message: 'Semester format is invalid' })
//     semester: string;
// }

