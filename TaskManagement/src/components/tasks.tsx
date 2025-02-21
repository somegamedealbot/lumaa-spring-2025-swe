import axios from "axios";
import React, {Dispatch, useEffect, useState} from "react";
import toast from "react-hot-toast";
import { TaskProps } from "./task";


interface TasksProps {
    setIsAuth: Dispatch<React.SetStateAction<boolean>>
}

export type Op = 'add' | 'update' | 'delete';

const taskAxios = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
})

interface AddFormData {
    title: string
    description: string | undefined
}

export interface UpdateFormData {
    changeCompleteStatus: boolean;
    newTitle: string | undefined;
    newDescription: string | undefined;
}

export const Tasks : React.FC<TasksProps> = ({setIsAuth}) => {
    const [tasks, setTasks] = useState([] as TaskProps[]);
    const [addTaskForm, setAddTaskForm] = useState<AddFormData>({ title:"", description:"" });
    const [updateTaskForm, setUpdateTaskForm] = useState<UpdateFormData>({
        changeCompleteStatus: false,
        newTitle: "",
        newDescription: ""
    });

    useEffect(() => {
        // get tasks
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

    const changeField = (e : React.ChangeEvent<HTMLInputElement>) => {
        const newFormData = {
            ...addTaskForm,
            [e.target.name]: e.target.value
        };
        setAddTaskForm(newFormData);
    }

    const updateTasksList = async (id: string, operation: Op) => {
        let newTasks : TaskProps[] = []
        if (operation === 'add') {
            const res = await taskAxios.post('/tasks', addTaskForm)
            if (res.status === 201) {
                newTasks = [...tasks];
                newTasks.push(res.data.task)
                toast.success('Successful created new task')
            }
            else {
                toast.error(res.data.message ? res.data.message : 'Unable to create new task')
            }
        }
        else if (operation === 'update'){
            const res = await taskAxios.put('/tasks/' + id, updateTaskForm)
            if (res.status === 200) {

                toast.success('Successfully created new task');
            }
            else {
                toast.error(res.data.message ? res.data.message : 'Unable to update task');
            }
        }
        else {
            const res = await taskAxios.delete('/tasks/' + id)
            if (res.status === 200) {
                newTasks = tasks.filter(task => task.id !== id);
                toast.success('Successfully deleted task');
            }
            else {
                toast.error(res.data.message ? res.data.message : 'Unable to delete task');
            }
        }

        setTasks(newTasks)
    }

    return (<>
        {/** Log out button*/}

        <button onClick={() => {
            localStorage.removeItem('jwt');
            setIsAuth(false);
        }}>Logout</button>  
        <h2>Tasks </h2> 

        <div>
            <h4>Add Task</h4>
            <form onSubmit={(e) => {
                e.preventDefault();
                updateTasksList("", "add");
            }}>
                <div>
                    <input type="text" name="title" placeholder="Title" 
                        onChange={changeField} value={addTaskForm.title}/>
                </div>
                <div>
                    <input type="text" name="description" placeholder="Desription" 
                        onChange={changeField} value={addTaskForm.description}/>
                </div>
                <div>
                    <button type="submit">Add Task</button>
                </div>
            </form>
        </div>
    </>)
}