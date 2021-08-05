import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetPostQueryDto {
  @IsUUID(4, { message: 'Must be in a Uuid format' })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly authorId: string;
}
