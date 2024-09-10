import { FormArray, FormControl } from '@angular/forms';

export interface projectData {
  name: string;
  description: string;
}

export interface project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  createdBy: number;
  createdOn: Date;
}

export enum ProjectStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
}

export interface paginatedProjectData {
  success: boolean;
  status: number;
  message: string;
  data: paginatedData;
}

export interface EmployeesProject {
  success: boolean;
  status: number;
  message: string;
  data: projectEmployeeData[];
}

export interface projectEmployeeData {
  project: project;
  tasks: number;
}

interface paginatedData {
  data: project[];
  totalPages: number;
  totalItems: number;
}

export interface projectForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  status: FormControl<ProjectStatus | null>;
  members: FormArray<FormControl<number | null>>;
}

export interface projectPostBody {
  name: string;
  description: string;
  status: ProjectStatus;
  members: { employeeId: number }[];
}

export interface projectRequestResponse {
  success: boolean;
  status: number;
  message: string;
  data: number;
}

export interface projectDeleteResponse {
  success: boolean;
  status: number;
  message: string;
  data: boolean;
}

export interface projectByIdResponse {
  success: boolean;
  status: number;
  message: string;
  data: projectByIdData;
}

export interface projectByIdData {
  createdBy: string;
  createdOn: Date;
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: Task[];
  members: Employee[];
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  pendingTasks: number;
}

export interface Employee {
  employeeId: number;
  employeeName: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
}

export interface ProjectCountResponse {
  success: boolean;
  status: number;
  message: string;
  data: ProjectCount;
}

export interface ProjectCount {
  total: number;
  active: number;
  pending: number;
  completed: number;
}
