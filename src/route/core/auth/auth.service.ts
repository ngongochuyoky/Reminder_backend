import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import UserService from 'src/route/v1/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { LoginPayload } from 'src/route/v1/user/interface/login.interface'
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  public async validateUser(payload: any): Promise<any> {
    const user = await this.userService.findOne({ email: payload.email })
    if (!user) throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED)
    return user
  }

  public async signUp(data: any): Promise<any> {
    const _data = data
    _data.fcmToken = [data.deviceId]
    const user = await this.userService.create(data)
    const token = await this._createToken(user)
    return {
      ...user,
      token,
    }
  }

  public async signIn(data: LoginPayload): Promise<any> {
    const user = await this.userService.findByLogin(data)
    const userInfo = await this.userService.findOne({ _id: user.id })
    const fcmToken: any[] = userInfo.fcmToken || []
    fcmToken.push(data.deviceId)
    const setFcmToken = new Set(fcmToken)
    await this.userService.updateOne(userInfo._id, { fcmToken: Array.from(setFcmToken) })
    const token = await this._createToken(user)
    return {
      ...user,
      token,
    }
  }

  public async signOut(user: any, data: any): Promise<any> {
    const setFcmToken = new Set(user.fcmToken)
    setFcmToken.delete(data.deviceId)
    return await this.userService.updateOne(user._id, { fcmToken: Array.from(setFcmToken) })
  }

  async _createToken(data: any): Promise<any> {
    const payload = {
      _id: data._id,
      id: data._id,
      email: data.email,
    }

    const accessToken = await this.jwtService.sign(payload)
    return accessToken
  }
}
