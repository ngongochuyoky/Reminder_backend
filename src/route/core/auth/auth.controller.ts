import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { Request as RequestExpress } from 'express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import SignUpDto from './dto/sign-up.dto'
import { AuthService } from './auth.service'
import SignInDto from './dto/sign-in.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import SignOutDto from './dto/sign-out.dto'

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto): Promise<any> {
    return await this.authService.signUp(body)
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDto): Promise<any> {
    return await this.authService.signIn(body)
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  async signOut(@Request() req: RequestExpress, @Body() body: SignOutDto): Promise<any> {
    const { user } = req
    return await this.authService.signOut(user, body)
  }
}
