import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CronModule } from 'src/util/cron/cron.module'
import { HistoryModule } from '../history/history.module'
import { UserModule } from '../user/user.module'
import { ReminderController } from './reminder.controller'
import { ReminderService } from './reminder.service'
import { Reminder, ReminderSchema } from './schema/reminder.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reminder.name, schema: ReminderSchema }]),
    forwardRef(() => CronModule),
    HistoryModule,
    UserModule,
  ],
  controllers: [ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
