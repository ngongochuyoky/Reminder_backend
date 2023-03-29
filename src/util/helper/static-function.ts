// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export default class ShareFunction {
  private static readonly processENV: any = process.env

  public static env() {
    return this.processENV
  }
  public static checkVariableIsNotNullOrEmpty(variable: any) {
    return variable !== undefined && variable != null && variable !== ''
  }
}
