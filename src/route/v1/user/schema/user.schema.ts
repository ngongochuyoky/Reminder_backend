import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true, autoIndex: true })
export class User {
  @Prop({
    type: String,
    trim: true,
    minlength: 6,
    default: '',
  })
  email?: string = ''

  @Prop({
    type: String,
    default: '',
  })
  password?: string = ''

  @Prop({
    type: String,
    default: '',
  })
  fullName?: string = ''

  @Prop({
    type: Array,
    default: [],
  })
  fcmToken?: string[] = []
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)
