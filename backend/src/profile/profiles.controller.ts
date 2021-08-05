import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { Role } from 'src/users/enums/role.enum';
import { ProfilesService } from './profiles.service';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponse({ status: 200, type: ProfileDto, isArray: true })
  @Roles(Role.ADMIN)
  @IsNeedActivation()
  @ApiBearerAuth()
  @Get()
  async getAllProfiles(): Promise<ProfileDto[]> {
    return this.profilesService.getAllProfiles();
  }

  @ApiOperation({ summary: 'Get profile by id' })
  @ApiResponse({ status: 200, type: ProfileDto })
  @Roles(Role.ADMIN)
  @IsNeedActivation()
  @ApiBearerAuth()
  @Get('/:profileId')
  async getProfileById(
    @Param('profileId', new ParseUUIDPipe()) profileId: string,
  ): Promise<ProfileDto> {
    return this.profilesService.getProfileById(profileId);
  }

  @ApiOperation({ summary: 'Update profile by id' })
  @ApiResponse({ status: 200, type: ProfileDto })
  @Roles(Role.ADMIN)
  @IsNeedActivation()
  @ApiBearerAuth()
  @Put('/:profileId')
  async updateProfileById(
    @Param('profileId', new ParseUUIDPipe()) profileId: string,
    @Body() profileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return this.profilesService.updateProfileById(profileId, profileDto);
  }
}
