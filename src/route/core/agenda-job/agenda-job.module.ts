import { Module } from '@nestjs/common'
import { AgendaJobService } from './agenda-job.service'
import { AgendaJobController } from './agenda-job.controller'
import { AgendaJob, AgendaJobSchema } from './schema/agenda.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forFeature([{ name: AgendaJob.name, schema: AgendaJobSchema }])],
  providers: [AgendaJobService],
  controllers: [AgendaJobController],
  exports: [AgendaJobService],
})
export class AgendaJobModule {}
