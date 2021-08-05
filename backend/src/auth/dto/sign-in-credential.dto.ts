import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignInCredentialDto {
  @ApiProperty({ example: 'admin@gmail.com', required: true })
  @IsEmail({}, { message: 'Incorrect format' })
  @IsString({ message: 'Must be a string' })
  readonly email: string;

  @ApiProperty({ example: 'admin', required: true })
  @Length(4, 40, { message: 'Password length must be between 4 and 40' })
  @IsString({ message: 'Must be a string' })
  readonly password: string;
}
