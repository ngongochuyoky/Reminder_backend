import { IsBoolean, IsDateString, IsEmpty, IsMongoId, IsString } from 'class-validator'

export default class CreateHistoryDto {
  @IsEmpty()
  @IsMongoId()
  readonly user?: string

  @IsEmpty()
  @IsMongoId()
  readonly history?: string

  @IsEmpty()
  @IsBoolean()
  readonly done?: boolean

  @IsEmpty()
  @IsDateString()
  readonly time?: string

  @IsEmpty()
  @IsString()
  readonly nameJob?: string
}
