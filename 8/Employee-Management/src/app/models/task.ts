import { FormControl } from "@angular/forms"

export interface paginatedTaskData {
    success: boolean,
    status: number,
    message: string,
    data: paginatedData
}

export interface paginatedData {
    data: Tasks[]
    totalPages: number,
    totalItems: number
}

export interface Tasks {
    id: number,
    name: string
    description: string
    status: TaskStatus
    assignerName: string
    assigneeName: string
    createdOn: Date
}

export enum TaskStatus {
    Pending = 0,
    Active = 1,
    Completed = 2
}

export interface TaskPostBody {
    name: string
    description: string
    assignedTo: number
    projectId: number
    status: TaskStatus
}

export interface TaskPostResponse {
    sucess: boolean
    status: number
    message: string
    data: number
}

export interface TaskForm {
    name: FormControl<string | null>
    description: FormControl<string | null>
    assignedTo: FormControl<number | null>
    projectId: FormControl<number | null>
    status: FormControl<TaskStatus | null>
}

export interface TaskByIdResponse {
    success: boolean
    status: number
    message: string
    data: {
        task: TaskById,
        reviews: TaskReview[] | null
    }
}

export interface TaskById {
    id: number
    name: string
    description: string
    status: TaskStatus
    assignerName: string
    assigneName: string
    createdOn: Date
}

export interface TaskReview {
    id: number
    content: string
    reviewedBy: string
    reviewerAvatarUrl: string
    createdOn: Date
}

export interface TaskReviewResponse {
    success: boolean
    status: number
    message: string
    data: number
}

export enum TaskType {
    Epic = 0,
    Feature = 1,
    Userstory = 2,
    Task = 3,
    Bug = 4
}