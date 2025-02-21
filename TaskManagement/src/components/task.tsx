import React from "react";

export interface TaskProps {
    id: string
    title: string
    description: string | undefined
    isComplete: boolean
}

export const Task : React.FC<TaskProps> = ({id, title, description, isComplete}) => {
    return <li id={id}>
        <div>{title}</div>
        <input type="checkbox" checked={isComplete}/>
        <button>Edit</button>
        <p>{description}</p>
    </li>
}