import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Agenda, JobPriority } from 'agenda/es'
import { AgendaJobService } from 'src/route/core/agenda-job/agenda-job.service'
import { ReminderService } from 'src/route/v1/reminder/reminder.service'
import ShareFunction from '../helper/static-function'

@Injectable()
export class CronService {
  private agenda: Agenda | undefined
  constructor(
    @Inject(forwardRef(() => ReminderService)) private readonly reminderService: ReminderService,
    private readonly agendaJobService: AgendaJobService,
  ) {
    this.init()
  }
  async init() {
    try {
      if (ShareFunction.checkVariableIsNotNullOrEmpty(ShareFunction.env().MONGODB_URL)) {
        this.agenda = new Agenda({ db: { address: ShareFunction.env().MONGODB_URL } })
        this.define()
        console.log(CronService.name, 'CronService init success')
        await this.agendaJobService.cleanFailedOrCompleteJob()
        this.start().then((r) => console.log(CronService.name, 'CronService start success'))
      } else {
        console.warn(CronService.name, 'MONGODB_URL was not found, CronService was not init')
      }
    } catch (e) {
      console.log(CronService.name, (e as any).toString())
    }
  }

  now(name: string, data: any = null) {
    return this.agenda.now(name, data)
  }

  define() {
    this.agenda?.define(
      'removeAgendaJobFailOrComplete',
      {
        priority: JobPriority.highest,
        concurrency: 1,
      },
      async (job: any) => {
        try {
          await this.agendaJobService.cleanFailedOrCompleteJob()
        } catch (e) {
          console.log(CronService.name, `cleanFailedOrCompleteJob ${e}`)
        }
      },
    )
    this.agenda?.define(
      'sendEmailToUser',
      {
        priority: JobPriority.highest,
        concurrency: 1,
      },
      async (job: any) => {
        try {
          await this.reminderService.sendEmailToUser()
        } catch (e) {
          console.log(CronService.name, `sendEmailToUser ${e}`)
        }
      },
    )
    this.agenda?.define(
      'sendNotificationToUser',
      {
        priority: JobPriority.highest,
        concurrency: 1,
      },
      async (job: any) => {
        try {
          await this.reminderService.sendNotificationToUser()
        } catch (e) {
          console.log(CronService.name, `sendNotificationToUser ${e}`)
        }
      },
    )
  }

  async start() {
    await this.agenda?.start()
    await this.agenda?.every('0 10,22 * * *', 'sendEmailToUser')
    await this.agenda?.every('0 10,22 * * *', 'sendNotificationToUser')
    await this.agenda?.every('1 minutes', 'removeAgendaJobFailOrComplete')
  }
}
