import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 'c30eee2a-6daa-424e-87eb-a974d8115b1b' })
  readonly id: string;

  @ApiProperty({ example: 'content' })
  readonly content: string;
}
