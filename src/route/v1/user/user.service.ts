import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schema/user.schema'
import { Model, Types } from 'mongoose'
import { MessagingPayload, MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api'
import * as bcryptjs from 'bcryptjs'
import { MailerService } from 'src/util/mailer/mailer.service'
import FCMMessageInterface from 'src/util/fcm/interface/fcm-message.interface'
import { FcmService } from 'src/util/fcm/fcm.service'

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly fcmService: FcmService,
  ) {}

  public async findAll(): Promise<any> {
    return this.model.find({}, '-password -fcmToken')
  }

  public async detail(id: Types.ObjectId): Promise<any> {
    return await this.model.findOne({ _id: id }, '-password -fcmToken')
  }

  public async getMe(user: any): Promise<any> {
    return await this.model.findOne({ _id: user._id }, '-password -fcmToken')
  }

  public async findOne(query: any): Promise<any> {
    const rs = await this.model.findOne(query)
    if (!rs) throw new HttpException('User does not exist', HttpStatus.CONFLICT)
    return rs
  }

  public async findByLogin({ email, password }): Promise<any> {
    const user = await this.model.findOne({ email: email })
    if (!user) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
    const passwordCompared = await bcryptjs.compareSync(password, user.password)
    if (passwordCompared) {
      return {
        _id: user._id,
        id: user._id,
        email: user.email,
      }
    }
    throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED)
  }

  public async create(data: any): Promise<any> {
    const user = await this.model.findOne({ email: data.email })
    if (user) throw new HttpException('User already exists', HttpStatus.CONFLICT)
    const _data = data
    _data.password = await bcryptjs.hash(data.password, 10)
    const newUser = await this.model.create(_data)
    const rs = await this.detail(newUser._id)
    return rs
  }

  public async updateOne(id: Types.ObjectId, data: any): Promise<any> {
    await this.model.updateOne({ _id: id }, data)
    return await this.detail(id)
  }

  public async pushFCMToUser(id: Types.ObjectId, message: FCMMessageInterface): Promise<any> {
    const user = await this.model.findOne({ _id: id })
    if (!user) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
    const tokens = this.filterTokenInvalid(user.fcmToken)
    if (tokens.length === 0) return
    const messages = {
      notification: {
        title: message.title,
        body: message.body,
      },
      tokens,
    } as MulticastMessage
    const resultSend = await this.fcmService.pushFCMToUser(messages)
    return resultSend
  }
  public filterTokenInvalid(fcmTokens: any[]) {
    return fcmTokens.filter((el: any) => el !== null && el !== undefined && el !== '')
  }
}
