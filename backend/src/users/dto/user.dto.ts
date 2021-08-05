import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Role } from '../enums/role.enum';

export class UserDto {
  @ApiProperty({ example: 'c30eee2a-6daa-424e-87eb-a974d8115b1b' })
  readonly id: string;

  @ApiProperty({ example: 'user@gmail.com' })
  readonly email: string;

  @ApiProperty({ example: 'USER', enum: Role })
  readonly role: string;

  @ApiProperty({ example: false })
  readonly isActivated: boolean;

  @ApiProperty({ example: 'aasdas' })
  @IsOptional()
  readonly activationLink: string;
}
