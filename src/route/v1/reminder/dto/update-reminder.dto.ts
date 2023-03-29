import { PartialType } from '@nestjs/swagger'
import CreateReminderDto from './create-reminder.dto'

export default class UpdateReminderDto extends PartialType(CreateReminderDto) {}
