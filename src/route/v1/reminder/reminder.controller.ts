import { Controller, UseGuards, Param, Get, Post, Put, Delete, Request, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard'
import { ReminderService } from './reminder.service'
import { Request as RequestExpress } from 'express'
import { Types } from 'mongoose'
import ParseObjectIdPipe from 'src/util/pipe/parse-object-id.pipe'
import CreateReminderDto from './dto/create-reminder.dto'
import UpdateReminderDto from './dto/update-reminder.dto'

@ApiTags('Reminder')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}
  @Get('')
  async getAll(): Promise<any> {
    return await this.reminderService.getAll()
  }

  @Get(':id')
  async detail(
    @Request() req: RequestExpress,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    const { user } = req
    return await this.reminderService.detail(id, user)
  }

  @Post('')
  @ApiBody({ type: CreateReminderDto })
  async create(@Request() req: RequestExpress, @Body() body: CreateReminderDto) {
    const { user } = req
    return await this.reminderService.create(body, user)
  }

  @Put(':id')
  @ApiBody({ type: UpdateReminderDto })
  async updateOne(
    @Request() req: RequestExpress,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateReminderDto,
  ) {
    const { user } = req
    return await this.reminderService.updateOne(id, body, user)
  }

  @Delete(':id')
  async deleteOne(
    @Request() req: RequestExpress,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    const { user } = req
    return await this.reminderService.deleteOne(id, user)
  }
}
