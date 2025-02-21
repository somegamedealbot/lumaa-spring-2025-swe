import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/task.module';
import { UserEntity } from './user/user.entity';
import { TaskEntity } from './tasks/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("PG_HOST"), // This is a string, which is correct for 'host'
        port: configService.get<number>("PG_PORT"), // Use '+' to convert to number
        username: configService.get<string>("PG_USER"),
        password: configService.get<string>("PG_PASSWORD"),
        database: configService.get<string>("PG_DB"),
        entities: [UserEntity, TaskEntity],
        synchronize: true
      })
    }),
    AuthModule, TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
