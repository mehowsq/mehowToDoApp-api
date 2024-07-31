import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class FindAllTasksDto {
  @IsOptional()
  @IsBoolean()
  @Transform((val) => {
    console.log('12312');
    if (val.value === 'true') {
      return true;
    } else if (val.value === 'false') {
      return false;
    }

    return val.value;
  })
  isCompleted?: boolean;
}
