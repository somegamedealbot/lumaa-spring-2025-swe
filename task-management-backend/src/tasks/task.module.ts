import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksController } from "./task.controller";
import {TaskEntity} from "./task.entity";
import { TaskService } from "./task.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity]), AuthModule],
    controllers: [TasksController],
    providers: [TaskService]
})

export class TaskModule {};
