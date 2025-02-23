import React, { useEffect, useState } from "react";
import { TaskOperation, TaskFormData, UpdateFormData } from "./tasks";

export interface TaskProps {
    task: TaskItem
    updateTasksList : <T extends TaskFormData>
        (id : string, operation : TaskOperation, formData? : T) => Promise<void>
    changeField : <T extends TaskFormData>
        (e : React.ChangeEvent<HTMLInputElement>, formData : T) => T
}

export interface TaskItem {
    id: string
    title: string
    description: string
    isComplete: boolean
}

export const Task : React.FC<TaskProps> = (
    {task, updateTasksList, changeField}) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [updateTaskForm, setUpdateTaskForm] = useState<UpdateFormData>({
        completeStatus: task.isComplete,
        newTitle: task.title,
        newDescription: task.description
    });

    useEffect(() => {
        setUpdateTaskForm({
            completeStatus: task.isComplete, 
            newTitle: task.title,
            newDescription: task.description
        })
    }, [task])

    if (editing) {
        return <li key={task.id}>
            <form onSubmit={async (e) => {
                e.preventDefault();
                updateTasksList(task.id, "update", updateTaskForm);
                setEditing(false);
            }}>
                <input type="checkbox" name="completeStatus" checked={updateTaskForm.completeStatus} 
                    onChange={
                        (e) => setUpdateTaskForm(changeField(e, updateTaskForm))
                    }/>
                <input type="text" name="newTitle" placeholder="New Title" value={updateTaskForm.newTitle}
                    onChange={
                        (e) => setUpdateTaskForm(changeField(e, updateTaskForm))
                    }/>
                <input name="newDescription" 
                    onChange={
                        (e) => setUpdateTaskForm(changeField(e, updateTaskForm))
                    } value={updateTaskForm.newDescription}/>
                <button onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit">Save</button>
                <button onClick={() => updateTasksList(task.id, "delete", updateTaskForm)}>Delete</button>
            </form>
        </li>
    }
    else {
        return <li key={task.id}>
            <div>
                <input type="checkbox" name="completeStatus" checked={updateTaskForm.completeStatus} onChange={
                    (e) => updateTasksList(task.id, "update", changeField(e, updateTaskForm))
                }/>
                <a>{task.title}</a>
                <a>{task.description}</a>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={() => updateTasksList(task.id, "delete")}>Delete</button>
            </div>
        </li>
    }
}