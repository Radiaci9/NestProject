import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { SignInCredentialDto } from './dto/sign-in-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { TokenDto } from './dto/token.dto';
import * as bcrypt from 'bcryptjs';
import { SignUpCredentialDto } from './dto/sign-up-credential.dto';
import { MailService } from 'src/common/mail/mail.service';
import { getHashedPassword } from 'src/common/functions';
import { v4 as uuid } from 'uuid';
import { INVALID_TOKENS_KEY } from 'src/common/constants';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private redisService: RedisService,
  ) {}

  async signIn(dto: SignInCredentialDto): Promise<TokenDto> {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) throw new HttpException('Email or password incorrect', 422);

    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (!passwordEquals)
      throw new HttpException('Email or password incorrect', 422);

    return this.generateToken(user);
  }

  async signUp(dto: SignUpCredentialDto): Promise<TokenDto> {
    const user = await this.usersService.createUser(dto);

    this.mailService.sendUserActivationMail(user);

    return this.generateToken(user);
  }

  async signOut(authorizationToken: string) {
    const token = authorizationToken.split(' ')[1];

    this.redisService.pushValues(INVALID_TOKENS_KEY, [token]);
  }

  async generateToken(user: UserDto): Promise<TokenDto> {
    return {
      token: this.jwtService.sign(user),
      // refreshToken: this.jwtService.sign(user),
    };
  }

  async sendResetPasswordLink(email: string): Promise<void> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user)
      throw new BadRequestException("User with this email doesn't exist");
    // need to rewrite when reset password page was exist
    const newPassword = uuid();
    const hashNewPassword = await getHashedPassword(newPassword);
    this.mailService.sendUserNewPasswordMail(user, newPassword);

    await this.usersService.updateUser(user.id, { password: hashNewPassword });
  }

  async activateUser(activationLink: string) {
    await this.usersService.activateUser(activationLink);
  }

  async resendActivationLink(email: string): Promise<void> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user)
      throw new BadRequestException("User with this email doesn't exist");

    if (!user.activationLink)
      throw new BadRequestException('User already activated');

    this.mailService.sendUserActivationMail(user);
  }
}
