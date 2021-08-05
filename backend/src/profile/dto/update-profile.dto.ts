import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'firstName', required: false })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly firstName: string;

  @ApiProperty({ example: 'lastName', required: false })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({ example: 'my biooooo', required: false })
  @MaxLength(512, { message: 'Length must be lower than 512 symbols' })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly bio: string;
}
