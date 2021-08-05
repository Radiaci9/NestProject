import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsNeedActivation } from 'src/common/decorators/activation-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/role.enum';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  @Roles(Role.ADMIN)
  @IsNeedActivation()
  @ApiBearerAuth()
  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, type: UserDto })
  @Roles(Role.ADMIN)
  @IsNeedActivation()
  @ApiBearerAuth()
  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: UserDto })
  @Roles(Role.ADMIN)
  @IsNeedActivation()
  @ApiBearerAuth()
  @Get('/:userId')
  async getUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<UserDto> {
    return this.usersService.getUserById(userId);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, type: UserDto })
  @Roles(Role.ADMIN)
  @IsNeedActivation()
  @ApiBearerAuth()
  @Put('/:userId')
  async updateUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() userDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.updateUserById(userId, userDto);
  }
}
