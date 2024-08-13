import { FormControl } from "@angular/forms"
import { department } from './department';

export enum EmployeeRole {
    Employee = 0,
    Admin = 1,
    SuperAdmin = 2
}
export interface Employee {
    id: number
    name: string
    departmentName: string | null
    departmentId: number | null
    managerName: string | null
    role: EmployeeRole
    salary: number
    email: string
    address: string
    phone: string | null
    imageUrl: string
    createdBy: string
    createdOn: Date
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
    name: string
    salary: number
    email: string
    phone: string | null
    address: string
    departmentId: number | null | undefined,
    managerId: number | null | undefined,
    role: EmployeeRole | null | undefined,
}

export interface updateEmployee {
    name: string | null | undefined
    salary: number | null | undefined
    email: string | null | undefined
    phone: string | null | undefined
    address: string | null | undefined
    departmentId: number | null | undefined,
    managerId: number | null | undefined,
    role: EmployeeRole | null | undefined,
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
    email: FormControl<string | null>
    phone: FormControl<string | null>
    address: FormControl<string | null>
    salary: FormControl<number | null>
    departmentId: FormControl<number | null>
    managerId: FormControl<number | null>
    role: FormControl<EmployeeRole | null>
}

export interface paginatedEmployeeData {
    success: boolean,
    status: number,
    message: string,
    data: paginatedData
}

export interface paginatedData {
    data: Employee[]
    totalPages: number,
    totalItems: number
}


