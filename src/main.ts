import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './route/app/app.module'
import ValidationExceptions from './util/exception/validation.exceptions'
import { ValidationError, ValidationPipe } from '@nestjs/common'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require('body-parser')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require('morgan')

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => new ValidationExceptions(errors),
    }),
  )
  const config = new DocumentBuilder()
    .setTitle('API Reminder app')
    .setDescription('API Reminder app')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  const port = process.env.PORT || 3000
  await app.listen(port, async () => {
    console.log(`The server is running at: http://localhost:${port}`)
  })
}
bootstrap()
