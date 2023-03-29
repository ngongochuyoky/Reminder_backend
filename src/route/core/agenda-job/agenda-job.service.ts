import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AgendaJob, AgendaJobDocument } from './schema/agenda.schema'

@Injectable()
export class AgendaJobService {
  constructor(@InjectModel(AgendaJob.name) private model: Model<AgendaJobDocument>) {}
  async cleanFailedOrCompleteJob() {
    try {
      // Xoa nhung job normal success done
      const queryNormal = {
        $and: [
          { type: 'normal' },
          { lastFinishedAt: { $lt: new Date(Date.now() - 1000 * 60) } },
          {
            nextRunAt: { $in: [null, ''] },
          },
          {
            lockedAt: { $in: [null, ''] },
          },
        ],
      }
      await this.model.deleteMany(queryNormal)

      // Nhung job bi pending, dead-lock, crash khi dang run
      // Update cong them 5s vao nextRunAt de job start lai
      // console.log('Date lt', new Date(Date.now() - 1000 * 60))
      // console.log('Date add', new Date(Date.now() + 1000 * 60))
      const querySingle = {
        $or: [
          {
            $and: [
              { type: 'single' },
              { lastFinishedAt: { $lt: new Date(Date.now() - 1000 * 60) } },
              {
                nextRunAt: { $in: [null, ''] },
              },
              {
                lockedAt: { $in: [null, ''] },
              },
            ],
          },
          {
            $and: [
              { type: 'single' },
              { lastFinishedAt: { $lt: new Date(Date.now() - 1000 * 60) } },
              {
                nextRunAt: { $lt: new Date(Date.now() - 1000 * 60) },
              },
              {
                lockedAt: { $lt: new Date(Date.now() - 1000 * 60) },
              },
            ],
          },
          {
            $and: [
              { type: 'single' },
              {
                nextRunAt: { $lt: new Date(Date.now() - 1000 * 60) },
              },
              {
                lastFinishedAt: { $in: [null, ''] },
              },
              {
                lockedAt: { $in: [null, ''] },
              },
            ],
          },
        ],
      }
      await this.model.updateMany(querySingle, {
        $set: {
          nextRunAt: new Date(Date.now() + 1000 * 60),
          lockedAt: null,
        },
      })
      return {}
    } catch (e) {
      console.log(AgendaJobService.name, (e as any).toString())
      return e
    }
  }
}
