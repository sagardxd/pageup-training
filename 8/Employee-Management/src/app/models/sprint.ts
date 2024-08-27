import { TaskStatus, TaskType } from './task';

export interface sprintGetBody {
  success: boolean;
  status: number;
  message: string;
  data: Sprint[];
}

export interface Sprint {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface sprintTaskResponse {
  success: boolean;
  status: number;
  message: string;
  data: sprintTasks[];
}

export interface sprintTasks {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  projectId: number;
  taskType: TaskType;
  assignerName: string;
  assigneeName: string;
  createdOn: Date;
}
