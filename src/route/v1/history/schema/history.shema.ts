import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Reminder } from '../../reminder/schema/reminder.schema'
import { User } from '../../user/schema/user.schema'

@Schema({ timestamps: true, autoIndex: true })
export class History {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  user?: User

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Reminder.name,
  })
  reminder?: Reminder

  @Prop({
    type: Boolean,
  })
  done?: boolean

  @Prop({
    type: Date,
  })
  time?: Date

  @Prop({
    type: String,
  })
  nameJob?: string

  @Prop({
    type: String,
  })
  messageId?: string
}

export type HistoryDocument = History & Document
export const HistorySchema = SchemaFactory.createForClass(History)
