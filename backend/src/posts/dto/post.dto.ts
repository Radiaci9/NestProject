import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ example: 'c30eee2a-6daa-424e-87eb-a974d8115b1b' })
  readonly id: string;

  @ApiProperty({ example: new Date().toString() })
  readonly createdAt: Date;

  @ApiProperty({ example: new Date().toString() })
  readonly updatedAt: Date;

  @ApiProperty({ example: 'title' })
  readonly title: string;

  @ApiProperty({ example: 'content' })
  readonly content: string;

  @ApiProperty({ example: false })
  readonly published: boolean;
}
