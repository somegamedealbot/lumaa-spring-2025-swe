import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'tasks'
})
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column()
    title: string

    @Column({nullable: true})
    description: string

    @Column({default: false})
    isComplete: boolean

}
