import { FormControl } from '@angular/forms';
import { dateRangeObject } from './task';
import { ApiResponse } from './commonModels';

export enum EmployeeRole {
  Employee = 0,
  Admin = 1,
  SuperAdmin = 2,
}

export interface Employee {
  id: number;
  name: string;
  departmentName: string | null;
  departmentID: number | null;
  managerName: string | null;
  managerID: number | null;
  role: EmployeeRole;
  salary: number;
  email: string;
  address: string;
  phone: string | null;
  imageUrl: string;
  createdBy: string;
  createdOn: Date;
}

export interface Employees {
  success: boolean;
  status: number;
  message: string;
  data: Employee[];
}

export interface postEmployee {
  username: string;
  password: string;
  name: string;
  salary: number;
  email: string;
  phone: string | null;
  address: string;
  departmentID: number | null;
  managerID: number | null;
  role: EmployeeRole | null;
}

export interface updateEmployee {
  name: string | null;
  salary: number | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  departmentID: number | null;
  managerID: number | null;
  role: EmployeeRole | null;
}

export interface postEmployeeResponse extends ApiResponse {
  data: number;
}

export interface EmployeeById extends ApiResponse {
  data: Employee;
}

export interface EmployeeForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  address: FormControl<string | null>;
  salary: FormControl<number | null>;
  departmentID: FormControl<number | null>;
  managerID: FormControl<number | null>;
  role: FormControl<EmployeeRole | null>;
}

export interface paginatedEmployeeData extends ApiResponse {
  data: paginatedData;
}

export interface paginatedData {
  data: Employee[];
  totalPages: number;
  totalItems: number;
}

export interface EmployeeCount {
  total: number;
  superAdmin: number;
  admin: number;
  employee: number;
}

export interface EmployeePaginatedBody {
  pageIndex: number;
  pagedItemsCount: number;
  orderKey: string;
  sortedOrder: number;
  search: string;
  dateRange: dateRangeObject | null;
  status: EmployeeRole | null;
}
