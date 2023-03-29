import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as admin from 'firebase-admin'
import { MessagingPayload, MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api'

@Injectable()
export class FcmService {
  constructor() {
    console.log('Oke:::, firebase')
    this.init()
  }
  init() {
    const pathFile = path.join(process.cwd(), './src/util/fcm//firebase-project-service.json')
    if (fs.existsSync(pathFile)) {
      const serviceAccount = fs.readFileSync(pathFile).toString()

      try {
        const serviceAccountObj = JSON.parse(serviceAccount)
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountObj),
        })
        console.log(FcmService.name, 'FcmService init success')
      } catch (e) {
        console.error(FcmService.name, (e as any).toString())
      }
    } else {
      console.warn(
        FcmService.name,
        `${__dirname}/firebase-project-service.json was not found, FcmService was not init`,
      )
    }
  }

  public async pushFCMToUser(fcmTokens: MulticastMessage): Promise<any> {
    try {
      return await admin.messaging().sendMulticast(fcmTokens)
    } catch (e) {
      console.log(FcmService.name, (e as any).toString())
    }
  }
}
