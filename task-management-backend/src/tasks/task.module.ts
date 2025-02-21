import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksController } from "./task.controller";
import {TaskEntity} from "./task.entity";
import { TaskService } from "./task.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([TaskEntity])],
    controllers: [TasksController],
    providers: [TaskService]
})

export class TaskModule {};
