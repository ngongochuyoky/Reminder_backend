import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import ShareFunction from '../helper/static-function'

@Injectable()
export class MailerService {
  private nodeMailerInstance: nodemailer.Transporter | undefined
  constructor() {
    this.init()
  }

  init() {
    try {
      this.nodeMailerInstance = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: ShareFunction.env().MAILER_GMAIL_USERNAME,
          pass: ShareFunction.env().MAILER_GMAIL_PASSWORD,
        },
      })
      console.log('MailerService GMAIL init')
    } catch (e) {
      console.log('error:::', e)
    }
  }

  public async sendEmail(to: string, subject: string, html: string) {
    try {
      const params = {
        from: ShareFunction.env().MAILER_FROM_NAME,
        to,
        subject,
        html,
      }
      const rs = await this.nodeMailerInstance?.sendMail(params)
      return rs
    } catch (err) {
      console.log('error::', err)
    }
  }
}
