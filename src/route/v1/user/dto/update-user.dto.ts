import { IsArray, IsOptional, IsString, Validate } from 'class-validator'

export default class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly fullName?: string

  @IsOptional()
  @IsArray()
  @Validate(IsString, {
    each: true,
  })
  readonly fcmToken?: any[]
}
