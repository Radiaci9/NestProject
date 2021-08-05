import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { v4 as uuid } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/common/redis/redis.service';

const CACHE_PREFIX = 'posts';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  async getAllPosts(
    isAdmin: boolean,
    userId: string,
    authorId: string,
  ): Promise<PostDto[]> {
    const additionalChecks = {};

    if (!isAdmin) {
      if (authorId && userId !== authorId) return [];
      additionalChecks['authorId'] = userId;
    } else if (authorId) {
      additionalChecks['authorId'] = authorId;
    }

    // const cachedPosts = await this.redisService.getValues(CACHE_PREFIX);

    const posts = await this.prismaService.post.findMany({
      where: additionalChecks,
    });

    // i don't know how use redis in request with query correctly
    // because we can lose some data
    return posts;
  }

  async createPost(userId: string, postDto: CreatePostDto): Promise<PostDto> {
    await this.usersService.getUserById(userId);

    const postId = uuid();
    const createdPost = await this.prismaService.post.create({
      data: {
        ...postDto,
        id: postId,
        authorId: userId,
      },
    });

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${postId}`,
      JSON.stringify(createdPost),
    );

    return createdPost;
  }

  async getPostById(
    isAdmin: boolean,
    userId: string,
    postId: string,
  ): Promise<PostDto> {
    const additionalChecks = {};

    if (!isAdmin) additionalChecks['authorId'] = userId;

    const cachedPost = await this.redisService.getValue(
      `${CACHE_PREFIX}-${postId}`,
    );

    if (cachedPost) {
      const post = JSON.parse(cachedPost);
      if (
        additionalChecks['authorId'] &&
        post['authorId'] !== additionalChecks['authorId']
      ) {
        return null;
      }
      return post;
    }

    const post = await this.prismaService.post.findFirst({
      where: {
        id: postId,
        ...additionalChecks,
      },
    });

    if (!post)
      throw new BadRequestException(
        `Post with this id doesn't exist ${
          !isAdmin && 'or data not available for current user'
        }`,
      );

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${postId}`,
      JSON.stringify(post),
    );

    return post;
  }

  async updatePostById(
    isAdmin: boolean,
    userId: string,
    postId: string,
    postDto: UpdatePostDto,
  ): Promise<PostDto> {
    const additionalChecks = {};

    if (!isAdmin) additionalChecks['authorId'] = userId;
    const post = await this.prismaService.post.findFirst({
      where: {
        id: postId,
        ...additionalChecks,
      },
    });

    if (!post)
      throw new BadRequestException(
        `Post with this id doesn't exist ${
          !isAdmin && 'or data not available for current user'
        }`,
      );

    const updatedPost = await this.prismaService.post.update({
      where: {
        id: postId,
      },
      data: postDto,
    });

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${postId}`,
      JSON.stringify(updatedPost),
    );

    return updatedPost;
  }
}
