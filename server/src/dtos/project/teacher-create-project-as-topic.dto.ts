import { IsNotEmpty, IsString, IsMongoId, IsEnum, IsOptional } from 'class-validator'
import { PROJECT_STATUS } from '@/constants/status'

export class TeacherCreateProjectAsTopicDto {
  @IsNotEmpty({ message: 'Project name is required' })
  @IsString({ message: 'Project name must be a string' })
  name: string

  @IsOptional()
  @IsString({ message: 'Project description must be a string' })
  description?: string

  @IsNotEmpty({ message: 'Campus is required' })
  @IsMongoId({ message: 'Invalid Campus ID format' })
  campus: string

  @IsOptional()
  @IsEnum([1, 2], { message: 'Category must be either 1 (student topic) or 2 (lecturer topic)' })
  category: 1 | 2 = 1 // Giả sử là của sinh viên (có thể thay đổi nếu cần)

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(PROJECT_STATUS, { message: 'Invalid project status' })
  status: number
}
