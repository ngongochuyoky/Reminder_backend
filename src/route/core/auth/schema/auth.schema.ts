import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true, autoIndex: true })
export class Auth {
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

export type AuthDocument = Auth & Document

export const AuthSchema = SchemaFactory.createForClass(Auth)
