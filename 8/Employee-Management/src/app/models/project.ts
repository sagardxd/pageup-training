import { FormArray, FormControl } from "@angular/forms"

export interface projectData {
    name: string
    description: string
}

export interface project {
    id: number
    name: string
    description: string
    status: ProjectStatus
    createdBy: number
    updatedBy: number | null,
    createdOn: Date
    updatedOn: Date | null
}

export enum ProjectStatus {
    Pending = 0,
    Active = 1,
    Complete = 2,
}

export interface paginatedProjectData {
    success: boolean,
    status: number,
    message: string,
    data: paginatedData
}

interface paginatedData {
    data: project[]
    totalPages: number,
    totalItems: number
}

export interface projectForm {
    name: FormControl<string | null>
    description: FormControl<string | null>
    status: FormControl<ProjectStatus | null>
    members: FormArray<FormControl<number>>
}