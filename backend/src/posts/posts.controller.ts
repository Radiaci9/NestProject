import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IsNeedActivation } from 'src/common/decorators/activation-user.decorator';
import { Role } from 'src/users/enums/role.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostQueryDto } from './dto/get-post-query.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: 'Get all available posts' })
  @ApiResponse({ status: 200, type: PostDto, isArray: true })
  @IsNeedActivation()
  @ApiBearerAuth()
  @ApiQuery({ name: 'authorId', type: String, required: false })
  @Get()
  async getAllPosts(
    @Query() queryParams: GetPostQueryDto,
    @Req() request: Request,
  ): Promise<PostDto[]> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.postsService.getAllPosts(isAdmin, userId, queryParams.authorId);
  }

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, type: PostDto })
  @IsNeedActivation()
  @ApiBearerAuth()
  @Post()
  async createPost(
    @Req() request: Request,
    @Body() profileDto: CreatePostDto,
  ): Promise<PostDto> {
    const userId = request['user']['id'];
    return this.postsService.createPost(userId, profileDto);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiResponse({ status: 200, type: PostDto })
  @IsNeedActivation()
  @ApiBearerAuth()
  @Get('/:postId')
  async getProfileById(
    @Req() request: Request,
    @Param('postId', new ParseUUIDPipe()) postId: string,
  ): Promise<PostDto> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.postsService.getPostById(isAdmin, userId, postId);
  }

  @ApiOperation({ summary: 'Update post by id' })
  @ApiResponse({ status: 200, type: PostDto })
  @IsNeedActivation()
  @ApiBearerAuth()
  @Put('/:postId')
  async updatePostById(
    @Req() request: Request,
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() postDto: UpdatePostDto,
  ): Promise<PostDto> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.postsService.updatePostById(isAdmin, userId, postId, postDto);
  }
}
