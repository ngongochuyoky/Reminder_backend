import { Injectable, HttpStatus, HttpException, forwardRef, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Reminder, ReminderDocument } from './schema/reminder.schema'
import { Model, Types } from 'mongoose'
import { CronService } from 'src/util/cron/cron.service'
import { HistoryService } from '../history/history.service'
import UserService from '../user/user.service'
// import { FcmService } from 'src/util/fcm/fcm.service'
import { MailerService } from 'src/util/mailer/mailer.service'

@Injectable()
export class ReminderService {
  constructor(
    @InjectModel(Reminder.name) private model: Model<ReminderDocument>,
    private readonly historyService: HistoryService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    // private readonly fcmService: FcmService,
    @Inject(forwardRef(() => CronService)) private readonly cronService: CronService,
  ) {}

  public async getAll(): Promise<any> {
    const rs = await this.model.find()
    return rs
  }

  public async detail(id: Types.ObjectId, user: any): Promise<any> {
    const rs = await this.model.findOne({ _id: id })
    return rs
  }

  public async findOne(id: Types.ObjectId): Promise<any> {
    const rs = await this.model.findOne({ _id: id })
    if (!rs) throw new HttpException('Reminder does not exist', HttpStatus.CONFLICT)
    return rs
  }

  public async create(data: any, user: any): Promise<any> {
    const _data = data
    _data.user = user._id
    const rs = await this.model.create(_data)
    return rs
  }

  public async updateOne(id: Types.ObjectId, data: any, user: any): Promise<any> {
    const rs = await this.model.updateOne({ _id: id, user: user._id }, data)
    return rs
  }

  public async deleteOne(id: Types.ObjectId, user: any): Promise<any> {
    const rs = await this.model.deleteOne({ _id: id, user: user._id })
    return rs
  }

  public async sendEmailToUser(): Promise<any> {
    const reminders: any[] = await this.model.find().populate('user', '-password')
    if (reminders?.length) {
      for (const reminder of reminders) {
        const history: any = {
          user: reminder.user._id,
          reminder: reminder._id,
          time: Date.now(),
          nameJob: 'Send Email',
          done: true,
        }
        try {
          const to = reminder.user.email
          const subject = reminder.title
          const html = `<b>${reminder.description}</b>`
          const rs = await this.mailerService.sendEmail(to, subject, html)
          history.messageId = rs.messageId
        } catch (err) {
          history.done = false
          console.log(err)
        }
        await this.historyService.create(history)
      }
    }
  }

  public async sendNotificationToUser(): Promise<any> {
    // console.log('Send message notification to user')
    const reminders: any[] = await this.model.find().populate('user')
    // push array, insertmany
    if (reminders?.length) {
      for (const reminder of reminders) {
        const history: any = {
          user: reminder.user._id,
          reminder: reminder._id,
          time: Date.now(),
          nameJob: 'Send notification',
          done: true,
        }
        try {
          const message = {
            title: reminder.title,
            body: reminder.description,
          }
          // const rs = await this.userService.pushFCMToUser(reminder.user._id, message)
          // history.messageId = rs.responses[0].messageId
        } catch (err) {
          history.done = false
          console.log(err)
        }
        await this.historyService.create(history)
      }
    }
  }

  // promise.all
}
