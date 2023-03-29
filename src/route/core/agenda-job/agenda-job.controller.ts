import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Request as RequestExpress } from 'express'
import { AgendaJobService } from './agenda-job.service'

@ApiTags('Agenda Job')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agenda-job')
export class AgendaJobController {
  constructor(private readonly service: AgendaJobService) {}
  @Get('clean-fix')
  async cleanFix(@Request() req: RequestExpress): Promise<any> {
    const { user } = req
    const rs = await this.service.cleanFailedOrCompleteJob()
    return rs
  }
}
