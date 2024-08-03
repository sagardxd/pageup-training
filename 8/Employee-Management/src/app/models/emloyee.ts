import { FormControl } from "@angular/forms"
import { department } from './department';

export enum Role {
    Employee = 0,
    Admin = 1,
    SuperAdmin = 2
}
export interface Employee {
    id: number,
    name: string,
    departmentName: string | null
    departmentId: number | null
    managerName: string | null
    managerId: number | null
    role: Role,
    salary: number,
    createdBy: number
    updatedBy: number | null
    createdOn: Date
    updatedOn: Date | null
}
export interface Employees {
    success: boolean,
    status: number,
    message: string,
    data: Employee[]
}

export interface postEmployee {
    username: string
    password: string
    name: string,
    salary: number
    departmentId: number | null | undefined,
    managerId: number | null | undefined,
    role: Role | null | undefined,
}

export interface updateEmployee {
    name: string,
    salary: number
    departmentId: number | null | undefined,
    managerId: number | null | undefined,
    role: Role | null | undefined,
}

export interface postEmployeeResponse {
    success: boolean,
    status: number,
    message: string,
    data: number
}

export interface EmployeeById {
    success: boolean,
    status: number,
    message: string,
    data: Employee
}

export interface EmployeeForm {
    username: FormControl<string | null>
    password: FormControl<string | null>
    name: FormControl<string | null>
    salary: FormControl<number | null>
    departmentId: FormControl<number | null>
    managerId: FormControl<number | null>
    role: FormControl<Role | null>
}



