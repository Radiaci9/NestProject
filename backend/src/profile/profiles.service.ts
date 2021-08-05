import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { ProfileService } from './profile.service';

export const CACHE_PREFIX = 'profiles';

@Injectable()
export class ProfilesService {
  constructor(
    private prismaService: PrismaService,
    private profileService: ProfileService,
    private redisService: RedisService,
  ) {}

  async getAllProfiles(): Promise<ProfileDto[]> {
    const cachedProfiles = await this.redisService.getValue(CACHE_PREFIX);

    if (cachedProfiles) return JSON.parse(cachedProfiles);

    const profiles = await this.prismaService.profile.findMany();

    await this.redisService.setValue(CACHE_PREFIX, JSON.stringify(profiles));

    return profiles;
  }

  async getProfileById(profileId: string): Promise<ProfileDto> {
    const cachedProfile = await this.redisService.getValue(
      `${CACHE_PREFIX}-${profileId}`,
    );

    if (cachedProfile) return JSON.parse(cachedProfile);

    const profile = await this.prismaService.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile)
      throw new BadRequestException("Profile with this id doesn't exist");

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${profileId}`,
      JSON.stringify(profile),
    );

    return profile;
  }

  async updateProfileById(
    profileId: string,
    profileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile)
      throw new BadRequestException("Profile with this id doesn't exist");

    const updatedProfile = await this.profileService.updateProfileById(
      profileId,
      profileDto,
    );

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${profileId}`,
      JSON.stringify(updatedProfile),
    );
    await this.redisService.delKey(CACHE_PREFIX);

    return updatedProfile;
  }
}
