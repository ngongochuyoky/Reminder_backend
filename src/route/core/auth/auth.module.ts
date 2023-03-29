import { Module, forwardRef, Global } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
// import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from 'src/route/v1/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
// import { Auth, AuthSchema } from './schema/auth.schema'
import { JwtStrategy } from './jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    // MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    forwardRef(() => UserModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRATIONTIME'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
