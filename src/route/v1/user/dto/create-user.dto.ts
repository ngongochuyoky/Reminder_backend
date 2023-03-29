import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator'

export default class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(128)
  readonly email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  readonly password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly fullName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @Validate(IsString, {
    each: true,
  })
  readonly fcmToken?: any[]
}
