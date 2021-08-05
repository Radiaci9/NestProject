import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 'c30eee2a-6daa-424e-87eb-a974d8115b1b' })
  readonly id: string;

  @ApiProperty({ example: 'content' })
  readonly content: string;

  @ApiProperty({ example: '0226ccc2-7abb-4ee5-ad03-0002d6b9e0b8' })
  readonly postId: string;

  @ApiProperty({ example: '056445cf-9d85-4f97-9fbd-ba5c703891cc' })
  readonly authorId: string;
}
