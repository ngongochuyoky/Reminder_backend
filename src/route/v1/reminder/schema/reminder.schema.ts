import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { User } from '../../user/schema/user.schema'

@Schema({ timestamps: true, autoIndex: true })
export class Reminder {
  @Prop({
    type: String,
  })
  title: string

  @Prop({
    type: String,
  })
  description: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    customPopulate: {
      path: 'ownedBy',
      select: 'username email',
    },
  })
  user: User
}

export type ReminderDocument = Reminder & Document

export const ReminderSchema = SchemaFactory.createForClass(Reminder)
