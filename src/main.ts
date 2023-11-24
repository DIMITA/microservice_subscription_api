import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const user = 'guest';
const pwd = 'guest';
const host = 'localhost';
const port = 5672;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${pwd}@${host}:${port}`],
      queue: 'sendmail_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen(3009);
}
bootstrap();
