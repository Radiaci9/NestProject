import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'content', required: true })
  @MaxLength(512, { message: 'Length must be lower than 512 symbols' })
  @IsString({ message: 'Must be a string' })
  readonly content: string;
}
