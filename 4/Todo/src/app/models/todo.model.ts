export enum Gender{
    male = 1,
    female = 2
}

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    editing: boolean;
    checked: boolean;
    createdBy: string;
    createdAt: Date;
    completedAt: Date;  
    gender: Gender;
}