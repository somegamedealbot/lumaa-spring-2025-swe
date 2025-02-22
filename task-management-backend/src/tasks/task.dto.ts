export class Task {
    id: string;
    title: string;
    description: string | undefined;
    isComplete: boolean;
}

export class TaskCreate {
    title: string;
    description: string | undefined;
}

export class TaskUpdate {
    completeStatus: boolean;
    newTitle: string;
    newDescription: string;
}