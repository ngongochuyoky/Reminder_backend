import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: false, autoIndex: true, collection: 'agendaJobs' })
export class AgendaJob {
  @Prop({
    type: Date,
  })
  nextRunAt?: Date

  @Prop({
    type: Date,
  })
  lockedAt?: Date
}
export type AgendaJobDocument = AgendaJob & Document

export const AgendaJobSchema = SchemaFactory.createForClass(AgendaJob)
