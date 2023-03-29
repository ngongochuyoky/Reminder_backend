import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class CreateReminderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly title?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description?: string
}
