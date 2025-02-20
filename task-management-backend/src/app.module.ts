import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        database: configService.get<string>("PG_USER_DB"),
        entities: [],
        synchronize: true,
      })
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
