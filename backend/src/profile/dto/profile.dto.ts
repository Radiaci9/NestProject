import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ example: 'c30eee2a-6daa-424e-87eb-a974d8115b1b' })
  readonly id: string;

  @ApiProperty({ example: 'firstName' })
  readonly firstName: string;

  @ApiProperty({ example: 'lastName' })
  readonly lastName: string;

  @ApiProperty({ example: 'my biooooo' })
  readonly bio: string;
}