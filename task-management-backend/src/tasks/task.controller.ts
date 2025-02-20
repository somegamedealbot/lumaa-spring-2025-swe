import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskCreate, TaskUpdate } from "./task.dto";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private taskService : TaskService){}

    @Get()
    async getTasks(){
        const tasks = await this.taskService.getTasks();
        return { tasks } 
    }
    
    @Post()
    async createTask(@Body() taskCreate: TaskCreate){
        const task = await this.taskService.createTask(taskCreate);
        return { task }
    }

    @Put(':id')
    async updateTask(@Body() taskUpdate : TaskUpdate, @Param('id') id: string){
        const updatedTask = await this.taskService.editTask(id, taskUpdate);
        return { updatedTask };
        
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string){
        const deleted = await this.taskService.deleteTask(id);
        return { deleted };
    }

}