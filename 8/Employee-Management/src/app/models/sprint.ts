import { ApiResponse } from './commonModels';
import { TaskStatus, TaskType } from './task';

export interface sprintGetBody extends ApiResponse {
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

export interface sprintPostBody {
  name: string | null;
  startDate: Date | null;
  endDate: Date | null;
  projectId: number;
}

export interface sprintByIdResponse extends ApiResponse {
  data: Sprint;
}
