import axios from "axios";
import React, {Dispatch, useEffect, useState} from "react";
import toast from "react-hot-toast";
import { Task, TaskItem } from "./task";

interface TasksProps {
    setIsAuth: Dispatch<React.SetStateAction<boolean>>
}

export type TaskOperation = 'add' | 'update' | 'delete';
export type TaskFormData = AddFormData | UpdateFormData | undefined

export interface AddFormData {
    title: string
    description: string
}
export interface UpdateFormData {
    completeStatus: boolean;
    newTitle: string;
    newDescription: string;
}

const taskAxios = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER
});

taskAxios.interceptors.request.use((config) => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`
    }
    return config;
}, (err) => Promise.reject(err));

export const Tasks : React.FC<TasksProps> = ({setIsAuth}) => {
    const [taskItems, setTasks] = useState([] as TaskItem[]);
    const [addTaskForm, setAddTaskForm] = useState<AddFormData>({ title:"", description:"" });

    useEffect(() => {
        taskAxios.get(import.meta.env.VITE_API_SERVER + '/tasks',)
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data.tasks);
                setTasks(res.data.tasks);
            }
            else {
                toast.error(res.data.message ? res.data.message : 'Unable to get tasks')
            }
        })
    }, [setTasks])
  
    const changeField = <T extends TaskFormData>
    (e : React.ChangeEvent<HTMLInputElement>, formData : T) => {
        const newFormData = {
            ...formData,
            [e.target.name]: e.target.value
        };
        if (e.target.name === 'completeStatus') {
            newFormData['completeStatus'] = e.target.checked
        };
        return newFormData;
    }

    const updateTasksList = async <T extends TaskFormData>
    (id : string, operation : TaskOperation, formData : T = undefined as T) => {
        let newTasks : TaskItem[] = []
        if (operation === 'add') {
            const res = await taskAxios.post('/tasks', formData)
            if (res.status === 201) {
                newTasks = [...taskItems];
                newTasks.push(res.data.task)
                toast.success('Successful created new task')
            }
            else {
                toast.error(res.data.message ? res.data.message : 'Unable to create new task')
            }
        }
        else if (operation === 'update'){
            const res = await taskAxios.put('/tasks/' + id, formData)
            if (res.status === 200) {
                const updateIndex = taskItems.findIndex(
                    (task) => task.id === res.data.updatedTask.id);
                newTasks = [...taskItems]
                newTasks[updateIndex] = res.data.updatedTask
                toast.success('Successfully edited task');
            }
            else {
                toast.error(res.data.message ? res.data.message : 'Unable to update task');
            }
        }
        else {
            const res = await taskAxios.delete('/tasks/' + id)
            if (res.status === 200) {
                newTasks = taskItems.filter(task => task.id !== id);
                toast.success('Successfully deleted task');
            }
            else {
                toast.error(res.data.message ? res.data.message : 'Unable to delete task');
            }
        }

        setTasks(newTasks);
    }

    return (<>
        <button onClick={() => {
            localStorage.removeItem('jwt');
            setIsAuth(false);
        }}>Logout</button>  

        <div>
            <h4>Add Task</h4>
            <form onSubmit={(e) => {
                e.preventDefault();
                updateTasksList("", "add", addTaskForm);
            }}>
                <div>
                    <input type="text" name="title" placeholder="Title" 
                        onChange={(e) => setAddTaskForm(changeField(e, addTaskForm))} value={addTaskForm.title} required={true}/>
                </div>
                <div>
                    <input type="text" name="description" placeholder="Desription" 
                        onChange={(e) => setAddTaskForm(changeField(e, addTaskForm))} value={addTaskForm.description}/>
                </div>
                <div>
                    <button type="submit">Add Task</button>
                </div>
            </form>
        </div>
        <h2>Tasks</h2>
        <div>
            <ul>
                {taskItems.map((task) => 
                    <Task key={task.id} task={task} updateTasksList={updateTasksList}
                        changeField={changeField}>
                    </Task>
                )}
            </ul>
        </div> 
    </>)
}