import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  Param,
  Redirect,
  // Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInCredentialDto } from './dto/sign-in-credential.dto';
import { Public } from '../common/decorators/public-route.decorator';
import { TokenDto } from './dto/token.dto';
import { SignUpCredentialDto } from './dto/sign-up-credential.dto';
import { IsNeedActivation } from 'src/common/decorators/activation-user.decorator';
// import { Response } from 'express';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, type: TokenDto })
  @Public()
  @Post('/signin')
  async signIn(@Body() credentialDto: SignInCredentialDto): Promise<TokenDto> {
    return await this.authService.signIn(credentialDto);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 201, type: TokenDto })
  @Public()
  @Post('/signup')
  async signUp(@Body() credentialDto: SignUpCredentialDto): Promise<TokenDto> {
    return this.authService.signUp(credentialDto);
  }

  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({ status: 204 })
  @IsNeedActivation(false)
  @ApiBearerAuth()
  @Get('/signout')
  async signOut(@Headers() headers) {
    const authorizationToken = headers['authorization'];

    return this.authService.signOut(authorizationToken);
  }

  //How to use two JWT service with different keys
  // @ApiOperation({ summary: 'Refresh Token' })
  // @Get('/refresh')
  // async refresh(@Res({ passthrough: true }) response: Response) {
  //   return this.authService.refresh(response.cookie['refreshToken']);
  // }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 204,
    description: 'Mail with new password was sent on your mail',
  })
  @Public()
  @Get('/reset/:email')
  async sendResetPasswordLink(@Param('email') email: string): Promise<any> {
    await this.authService.sendResetPasswordLink(email);
  }

  @ApiOperation({ summary: 'Activate user by activationLink' })
  @ApiResponse({ status: 204 })
  @Public()
  @Redirect(process.env.CLIENT_URL, 301)
  @Get('/activate/:link')
  async activateUser(@Param('link') activationLink: string): Promise<any> {
    await this.authService.activateUser(activationLink);
  }

  @ApiOperation({ summary: 'Resend activation mail' })
  @ApiResponse({ status: 204 })
  @Get('/resend/:email')
  async resendActivationLink(@Param('email') email: string): Promise<any> {
    await this.authService.resendActivationLink(email);
  }
}
