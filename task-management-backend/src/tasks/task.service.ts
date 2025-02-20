import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskEntity } from "./task.entity";
import { TaskCreate, TaskUpdate } from "./task.dto";

@Injectable()
export class TaskService {
    
    constructor(@InjectRepository(TaskEntity) private taskRepo : Repository<TaskEntity>){}
    
    getTasks() {
        return this.taskRepo.find({});
    }   

    async createTask(taskCreate : TaskCreate) {
        const task = this.taskRepo.create({
            title: taskCreate.title,
            description: taskCreate.description
        });
        
        try {
            return await this.taskRepo.save(task);
        }
        catch (e) {
            const message = e instanceof Error ? e.message : ''
            throw new HttpException({
                error: `Unable to create task`,
                message 
            },
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findTaskById(id : string){
        return this.taskRepo.findOneBy({
            id: id
        });
    }

    async editTask(id: string, update : TaskUpdate) {

        const task = await this.findTaskById(id);

        // update task if found
        if (task !== null) {
            
            try {
                task.isComplete = update.changeCompleteStatus ? !task.isComplete : task.isComplete;
                task.title = update.newTitle ? update.newTitle : task.title;
                task.description = update.newDescription ? update.newDescription : task.description;
                await this.taskRepo.save(task);
                return task
            }
            catch (e) {
                const message = e instanceof Error ? e.message : ''
                throw new HttpException({
                    error: `Unable to update task`,
                    message 
                },
                    HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        
        throw new BadRequestException();

    }

    async deleteTask(id: string) {
        const task = await this.findTaskById(id);

        if (task !== null) {
            try {
                await this.taskRepo.delete({id});
                return true;
            }
            catch (e) {
                const message = e instanceof Error ? e.message : ''
                throw new HttpException({
                    error: `Unable to delete task`,
                    message 
                },
                    HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        
        return false
    }



}