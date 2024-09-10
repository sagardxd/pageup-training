import { FormControl } from '@angular/forms';
import { project } from './project';

export interface paginatedTaskData {
  success: boolean;
  status: number;
  message: string;
  data: paginatedData;
}

export interface paginatedData {
  data: Tasks[];
  count: TaskCount;
  totalPages: number;
  totalItems: number;
}

export interface Tasks {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  assignerName: string;
  assigneeName: string;
  createdOn: Date;
}

export enum TaskStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
}

export interface TaskPostBody {
  name: string;
  description: string;
  assignedTo: number | null;
  sprintId: number;
  taskType: TaskType;
  parentId: number | null;
  projectId: number;
  status: TaskStatus;
  originalEstimateHours: number | null;
}

export interface TasUpdatetBody {
  name: string | null | undefined;
  description: string | null | undefined;
  assignedTo: number;
  sprintId: number;
  taskType: TaskType;
  parentId: number | null;
  projectId: number;
  status: TaskStatus;
  originalEstimateHours: number | null | undefined;
  remainingEstimateHours: number | null | undefined;
}

export interface TaskPostResponse {
  sucess: boolean;
  status: number;
  message: string;
  data: number;
}

export interface TaskForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  assignedTo: FormControl<number | null>;
  sprintId: FormControl<number | null>;
  taskType: FormControl<TaskType | null>;
  parentId: FormControl<number | null>;
  projectId: FormControl<number | null>;
  status: FormControl<TaskStatus | null>;
  originalEstimateHours: FormControl<number | null>;
  remainingEstimatedHours: FormControl<number | null>;
}

export interface TaskByIdResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    task: TaskById;
    reviews: TaskReview[] | null;
    subTasks: [subTasks] | null;
    parent: ParentTask | null;
  };
}

export interface ParentTask {
  id: number;
  name: string;
  taskType: TaskType;
}

export interface subTasks {
  id: number;
  name: string;
  taskType: TaskType;
}

export interface TaskById {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  projectId: number;
  taskType: TaskType;
  assignerName: string;
  assigneeName: string;
  assignedTo: number;
  parentId: number;
  sprintId: number;
  createdOn: Date;
  originalEstimateHours: number;
  remainingEstimateHours: number;
}

export interface TaskReview {
  id: number;
  content: string;
  reviewedBy: string;
  reviewerAvatarUrl: string;
  createdOn: Date;
  employeeId: number;
}

export interface TaskReviewResponse {
  success: boolean;
  status: number;
  message: string;
  data: number;
}

export enum TaskType {
  Epic = 0,
  Feature = 1,
  Userstory = 2,
  Task = 3,
  Bug = 4,
}

export interface TaskPaginationBodyTask {
  pageIndex: number;
  pagedItemsCount: number;
  orderKey: string;
  sortedOrder: number;
  search: string;
  dateRange: dateRangeObject | null;
  types: number[] | null;
  status: number[] | null;
  assign: boolean | null;
  assignedTo: number[] | null;
  sprintId: number | null;
}

export interface dateRangeObject {
  startDate: Date | null;
  endDate: Date | null;
}

export interface TaskPaginationResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    data: {
      tasks: taskpaginationData[];
      count: TaskCount;
    };
    totalPages: number;
    totalItems: number;
  };
}

export interface taskpaginationData {
  id: number;
  name: string;
  status: TaskStatus;
  assigneeName: string;
  taskType: TaskType;
  createdOn: Date;
}

export interface TaskLogResponse {
  success: boolean;
  status: number;
  message: string;
  data: TaskMessage[];
}

export interface TaskMessage {
  message: string;
}

export interface TaskCount {
  total: number;
  typeCount: {
    epic: number;
    feature: number;
    userStory: number;
    task: number;
    bug: number;
  };
  statusCount: {
    active: number;
    pending: number;
    completed: number;
  };
  assignCount: {
    assigned: number;
    unAssigned: number;
  };
}

export interface TaskByProjectIdAndTasktypeResponse {
  success: boolean;
  status: number;
  message: string;
  data: parentTaskList[];
}

export interface parentTaskList {
  id: number;
  name: string;
  taskType: TaskType;
}
