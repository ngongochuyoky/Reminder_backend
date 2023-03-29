import { Controller, Get, Post, Delete, Body, Request, UseGuards, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger'
import { Request as RequestExpress } from 'express'
import { JwtAuthGuard } from 'src/route/core/auth/jwt-auth.guard'
import { Types } from 'mongoose'
import ParseObjectIdPipe from 'src/util/pipe/parse-object-id.pipe'
import { HistoryService } from './history.service'
import CreateHistoryDto from './dto/create-history.dto'

@ApiTags('History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}
  @Get('')
  async getAll(): Promise<any> {
    console.log('oke:::')
    return await this.historyService.getAll()
  }

  @Get(':id')
  async detail(
    @Request() req: RequestExpress,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    return await this.historyService.detail(id)
  }

  @Post('')
  @ApiBody({ type: CreateHistoryDto })
  async create(@Request() req: RequestExpress, @Body() body: CreateHistoryDto) {
    return await this.historyService.create(body)
  }

  @Delete(':id')
  async deleteOne(
    @Request() req: RequestExpress,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    const { user } = req
    return await this.historyService.deleteOne(id, user)
  }
}
