import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CronModule } from 'src/util/cron/cron.module'
import { FcmModule } from 'src/util/fcm/fcm.module'
import { MailerModule } from 'src/util/mailer/mailer.module'
import { AuthModule } from '../core/auth/auth.module'
import { HistoryModule } from '../v1/history/history.module'
import { ReminderModule } from '../v1/reminder/reminder.module'
import { UserModule } from '../v1/user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    CronModule,
    FcmModule,
    MailerModule,
    AuthModule,
    UserModule,
    HistoryModule,
    ReminderModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
