import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'title', required: false })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly title: string;

  @ApiProperty({ example: 'content', required: false })
  @MaxLength(512, { message: 'Length must be lower than 512 symbols' })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly content: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  readonly published: boolean;
}
