import { Controller } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import UserService from './user.service'
import { Get, Request, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import CreateUserDto from './dto/create-user.dto'
import { Request as RequestExpress } from 'express'
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard'
import UpdateUserDto from './dto/update-user.dto'
import FCMMessageInterface from 'src/util/fcm/interface/fcm-message.interface'

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getAll(): Promise<any> {
    return await this.userService.findAll()
  }

  @Get('me')
  async getMe(@Request() req: RequestExpress): Promise<any> {
    const { user } = req
    console.log('req:::', user)
    return await this.userService.getMe(user)
  }

  @Post('')
  @ApiBody({ type: CreateUserDto })
  async create(@Request() req: RequestExpress, @Body() body: CreateUserDto): Promise<any> {
    return await this.userService.create(body)
  }

  @Post('fcm-push')
  async push(@Request() req: RequestExpress, @Body() body: FCMMessageInterface): Promise<any> {
    const data: any = req
    return await this.userService.pushFCMToUser(data.user._id, body)
  }
}
