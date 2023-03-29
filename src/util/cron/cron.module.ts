import { forwardRef, Global, Module } from '@nestjs/common'
import { AgendaJobModule } from 'src/route/core/agenda-job/agenda-job.module'
import { ReminderModule } from 'src/route/v1/reminder/reminder.module'
import { CronService } from './cron.service'

@Global()
@Module({
  imports: [AgendaJobModule, forwardRef(() => ReminderModule)],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
