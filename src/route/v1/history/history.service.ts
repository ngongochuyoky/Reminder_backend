import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { History, HistoryDocument } from './schema/history.shema'
import { Model, Types } from 'mongoose'

@Injectable()
export class HistoryService {
  constructor(@InjectModel(History.name) private model: Model<HistoryDocument>) {}
  public async getAll(): Promise<any> {
    console.log('oke')
    const rs = await this.model.find().populate('user reminder', '-password -fcmToken')
    return rs
  }

  public async detail(id: Types.ObjectId): Promise<any> {
    const rs = await this.model.findOne({ _id: id })
    return rs
  }

  public async findOne(id: Types.ObjectId): Promise<any> {
    const rs = await this.model.findOne({ _id: id })
    if (!rs) throw new HttpException('History does not exist', HttpStatus.CONFLICT)
    return rs
  }

  public async create(data: any): Promise<any> {
    const rs = await this.model.create(data)

    return rs
  }

  public async updateOne(id: Types.ObjectId, data: any): Promise<any> {
    const rs = await this.model.updateOne({ _id: id }, data)
    return rs
  }

  public async deleteOne(id: Types.ObjectId, user: any): Promise<any> {
    const rs = await this.model.deleteOne({ _id: id, user: user._id })
    return rs
  }
}
