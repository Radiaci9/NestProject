import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { SignUpCredentialDto } from 'src/auth/dto/sign-up-credential.dto';
import { v4 as uuid } from 'uuid';
import { getHashedPassword } from 'src/common/functions';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/common/redis/redis.service';

const CACHE_PREFIX = 'users';
@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    const cachedUsers = await this.redisService.getValue(CACHE_PREFIX);

    if (cachedUsers) return JSON.parse(cachedUsers);

    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActivated: true,
        activationLink: true,
      },
    });

    await this.redisService.setValue(CACHE_PREFIX, JSON.stringify(users));

    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async createUser(
    userDto: CreateUserDto | SignUpCredentialDto,
  ): Promise<UserDto> {
    const user = await this.getUserByEmail(userDto.email);

    if (user) throw new BadRequestException('This email address is busy');

    const hashPassword = await getHashedPassword(userDto.password);
    let activationLink = null;

    // i don't like this variant for check on isActivated field
    const newUserDto = userDto as CreateUserDto;

    if (!newUserDto.isActivated) {
      activationLink = uuid();
    }
    const userId = uuid();
    const newUser = await this.prismaService.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        ...userDto,
        id: userId,
        activationLink,
        password: hashPassword,
        profile: {
          create: {
            id: uuid(),
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActivated: true,
        activationLink: true,
      },
    });

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${userId}`,
      JSON.stringify(newUser),
    );
    await this.redisService.delKey(CACHE_PREFIX);

    return newUser;
  }

  async getUserById(userId: string): Promise<UserDto> {
    const cachedUser = await this.redisService.getValue(
      `${CACHE_PREFIX}-${userId}`,
    );

    if (cachedUser) return JSON.parse(cachedUser);

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActivated: true,
        activationLink: true,
      },
    });

    if (!user) throw new BadRequestException("User with this id doesn't exist");

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${userId}`,
      JSON.stringify(user),
    );

    return user;
  }

  async updateUserById(
    userId: string,
    userDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new BadRequestException("User with this id doesn't exist");

    return await this.updateUser(userId, userDto);
  }

  //not sure about naming for update functions
  async updateUser(userId, userDto): Promise<UserDto> {
    const data: any = {};

    if (userDto.password)
      data.password = await getHashedPassword(userDto.password);
    if (userDto.role) data.role = userDto.role;
    if (userDto.isActivated) data.isActivated = userDto.isActivated;

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        isActivated: true,
        activationLink: true,
      },
    });

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${userId}`,
      JSON.stringify(updatedUser),
    );
    await this.redisService.delKey(CACHE_PREFIX);

    return updatedUser;
  }

  async activateUser(activationLink: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        activationLink: activationLink,
      },
    });

    if (!user)
      throw new BadRequestException(
        "User already activated or activation link doesn't exist",
      );

    const updatedUser = await this.prismaService.user.update({
      where: {
        activationLink: activationLink,
      },
      data: {
        activationLink: null,
        isActivated: true,
      },
    });

    await this.redisService.setValue(
      `${CACHE_PREFIX}-${user.id}`,
      JSON.stringify(updatedUser),
    );
    await this.redisService.delKey(CACHE_PREFIX);

    return updatedUser;
  }
}
