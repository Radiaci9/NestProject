import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'password', required: false })
  @Length(4, 40, { message: 'Password length must be between 4 and 40' })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly password: string;

  @ApiProperty({
    example: 'USER',
    enum: Role,
    required: false,
    default: Role.USER,
  })
  @IsEnum(Role, {
    message: `Must be one of [${Object.values(Role).join(', ')}]`,
  })
  @IsOptional()
  readonly role: Role;

  @ApiProperty({ example: false, required: false })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  readonly isActivated: boolean;
}
