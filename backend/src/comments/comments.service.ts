import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { v4 as uuid } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { GetCommentQueryDto } from './dto/get-comment-query.dto';
import { RedisService } from 'src/common/redis/redis.service';

const CACHE_PREFIX = 'comments';

@Injectable()
export class CommentsService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  async getAllComments(
    isAdmin: boolean,
    userId: string,
    { authorId, postId }: GetCommentQueryDto,
  ): Promise<CommentDto[]> {
    const additionalChecks = {};

    if (!isAdmin) {
      if (authorId && userId !== authorId) return [];
      additionalChecks['authorId'] = userId;
      if (postId) additionalChecks['postId'] = postId;
    } else {
      if (authorId) additionalChecks['authorId'] = authorId;
      if (postId) additionalChecks['postId'] = postId;
    }

    const comments = await this.prismaService.comment.findMany({
      where: additionalChecks,
    });

    return comments;
  }

  async createComment(
    userId: string,
    commentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    await this.usersService.getUserById(userId);

    const commentId = uuid();
    const createdComment = await this.prismaService.comment.create({
      data: {
        ...commentDto,
        id: commentId,
        authorId: userId,
      },
    });

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${commentId}`,
      JSON.stringify(createdComment),
    );

    return createdComment;
  }

  async getCommentById(
    isAdmin: boolean,
    userId: string,
    commentId: string,
  ): Promise<CommentDto> {
    const additionalChecks = {};

    if (!isAdmin) additionalChecks['authorId'] = userId;

    const cachedComment = await this.redisService.getValue(
      `${CACHE_PREFIX}-${commentId}`,
    );

    if (cachedComment) {
      const comment = JSON.parse(cachedComment);
      if (
        additionalChecks['authorId'] &&
        comment['authorId'] !== additionalChecks['authorId']
      ) {
        return null;
      }
      return comment;
    }

    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        ...additionalChecks,
      },
    });

    if (!comment)
      throw new BadRequestException(
        `Comment with this id doesn't exist ${
          !isAdmin && 'or data not available for current user'
        }`,
      );

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${commentId}`,
      JSON.stringify(comment),
    );

    return comment;
  }

  async updateCommentById(
    isAdmin: boolean,
    userId: string,
    commentId: string,
    commentDto: UpdateCommentDto,
  ): Promise<CommentDto> {
    const additionalChecks = {};

    if (!isAdmin) additionalChecks['authorId'] = userId;
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        ...additionalChecks,
      },
    });

    if (!comment)
      throw new BadRequestException(
        `Comment with this id doesn't exist ${
          !isAdmin && 'or data not available for current user'
        }`,
      );

    const updatedComment = await this.prismaService.comment.update({
      where: {
        id: commentId,
      },
      data: commentDto,
    });

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${commentId}`,
      JSON.stringify(updatedComment),
    );

    return updatedComment;
  }

  async deleteCommentById(
    isAdmin: boolean,
    userId: string,
    commentId: string,
  ): Promise<void> {
    const additionalChecks = {};

    if (!isAdmin) additionalChecks['authorId'] = userId;

    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        ...additionalChecks,
      },
    });

    if (!comment)
      throw new BadRequestException(
        `Comment with this id doesn't exist ${
          !isAdmin && 'or data not available for current user'
        }`,
      );

    await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });

    await this.redisService.delKey(`${CACHE_PREFIX}-${commentId}`);
  }
}
