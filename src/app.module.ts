import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ClientRMQ, ClientsModule, Transport } from '@nestjs/microservices';
import { Users } from './users/entities/user.entity';

const user = 'guest';
const pwd = 'guest';
const host = 'rabbitmq';
const port = 5672;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'rootpw',
      database: 'subscription',
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      logging: true,
    }),
    TypeOrmModule.forFeature([Users]),
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${user}:${pwd}@${host}:${port}`],
          queue: 'sendmail_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ClientRMQ],
})
export class AppModule {}
