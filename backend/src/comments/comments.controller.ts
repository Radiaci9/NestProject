import {
  Body,
  Controller,
  Delete,
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
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentQueryDto } from './dto/get-comment-query.dto';
import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Get all available comments' })
  @ApiResponse({ status: 200, type: CommentDto, isArray: true })
  @IsNeedActivation()
  @ApiBearerAuth()
  @ApiQuery({ name: 'authorId', type: String, required: false })
  @ApiQuery({ name: 'postId', type: String, required: false })
  @Get()
  async getAllComments(
    @Query() queryParams: GetCommentQueryDto,
    @Req() request: Request,
  ): Promise<CommentDto[]> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.commentsService.getAllComments(isAdmin, userId, queryParams);
  }

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, type: CommentDto })
  @IsNeedActivation()
  @ApiBearerAuth()
  @Post()
  async createComment(
    @Req() request: Request,
    @Body() profileDto: CreateCommentDto,
  ): Promise<CommentDto> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.commentsService.createComment(isAdmin, userId, profileDto);
  }

  @ApiOperation({ summary: 'Get comment by id' })
  @ApiResponse({ status: 200, type: CommentDto })
  @IsNeedActivation()
  @ApiBearerAuth()
  @Get('/:commentId')
  async getProfileById(
    @Req() request: Request,
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
  ): Promise<CommentDto> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.commentsService.getCommentById(isAdmin, userId, commentId);
  }

  @ApiOperation({ summary: 'Update comment by id' })
  @ApiResponse({ status: 200, type: CommentDto })
  @IsNeedActivation()
  @ApiBearerAuth()
  @Put('/:commentId')
  async updateCommentById(
    @Req() request: Request,
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @Body() commentDto: UpdateCommentDto,
  ): Promise<CommentDto> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.commentsService.updateCommentById(
      isAdmin,
      userId,
      commentId,
      commentDto,
    );
  }

  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiResponse({ status: 204 })
  @IsNeedActivation()
  @ApiBearerAuth()
  @Delete('/:commentId')
  async deleteCommentById(
    @Req() request: Request,
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
  ): Promise<void> {
    const userId = request['user']['id'];
    const isAdmin = request['user']['role'] === Role.ADMIN;
    return this.commentsService.deleteCommentById(isAdmin, userId, commentId);
  }
}
