import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule, 
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
        entities: [User],
        synchronize: true,
      })
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
