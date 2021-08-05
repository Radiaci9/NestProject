import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IsNeedActivation } from 'src/common/decorators/activation-user.decorator';
import { ProfileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, type: ProfileDto, isArray: true })
  @ApiBearerAuth()
  @Get()
  async getProfile(@Req() request: Request): Promise<any> {
    const userId = request['user']['id'];
    return this.profileService.getProfileByUserId(userId);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, type: ProfileDto })
  @ApiBearerAuth()
  @Put()
  async updateProfileById(
    @Req() request: Request,
    @Body() profileDto: UpdateProfileDto,
  ): Promise<any> {
    const userId = request['user']['id'];
    return this.profileService.updateProfileByUserId(userId, profileDto);
  }
}
