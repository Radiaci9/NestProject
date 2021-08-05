import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { CACHE_PREFIX } from './profiles.service';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async getProfileByUserId(userId: string): Promise<ProfileDto> {
    const profile = await this.prismaService.profile.findFirst({
      where: {
        userId,
      },
    });

    if (!profile)
      throw new BadRequestException("Profile with this id doesn't exist");

    return profile;
  }

  async updateProfileByUserId(
    userId: string,
    profileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const profile = await this.prismaService.profile.findFirst({
      where: {
        userId,
      },
    });

    if (!profile) throw new BadRequestException("User profile doesn't exist");

    const updatedProfile = await this.updateProfileById(profile.id, profileDto);

    return updatedProfile;
  }

  async updateProfileById(
    profileId: string,
    profileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const updatedProfile = await this.prismaService.profile.update({
      where: {
        id: profileId,
      },
      data: profileDto,
    });

    return updatedProfile;
  }
}
