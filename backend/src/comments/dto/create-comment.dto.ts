import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: '9c54ab69-f00e-49d0-a3db-21598b275f53',
    required: true,
  })
  @IsUUID(4, { message: 'Must be in a Uuid format' })
  @IsString({ message: 'Must be a string' })
  readonly postId: string;

  @ApiProperty({ example: 'content', required: false })
  @MaxLength(512, { message: 'Length must be lower than 512 symbols' })
  @IsString({ message: 'Must be a string' })
  readonly content: string;
}
