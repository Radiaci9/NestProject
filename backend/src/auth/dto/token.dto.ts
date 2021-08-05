import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ example: 'tokeeeeeeeeeeeen' })
  readonly token: string;
}
