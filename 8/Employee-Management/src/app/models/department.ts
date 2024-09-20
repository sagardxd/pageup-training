import { ApiResponse } from './commonModels';

export interface departmentData {
  id: number;
  name: string;
  createdBy: number;
  updatedBy: number | null;
  createdOn: Date;
  updatedOn: Date | null;
}

export interface departments extends ApiResponse {
  data: departmentData[];
}

export interface department extends ApiResponse {
  data: departmentData;
}
export interface postDepartmentResponse extends ApiResponse {
  data: number;
}
export interface deleteDepartmentResponse extends ApiResponse {
  data: boolean;
}

export interface paginatedBody {
  pageIndex: number;
  pagedItemsCount: number;
  orderKey: string;
  sortedOrder: number;
  search: string;
  dateRange: dateRangeObject | null;
}

interface dateRangeObject {
  startDate: Date | null;
  endDate: Date | null;
}

export interface paginatedDepartmentData extends ApiResponse {
  data: paginatedData;
}

export interface paginatedData {
  data: departmentData[];
  totalPages: number;
  totalItems: number;
}
export interface paginatedDepartmentDataList {
  data: paginatedData;
}

export interface DepartmentCountResponse extends ApiResponse {
  data: DepartmentCount[];
}

export interface DepartmentCount {
  name: string;
  count: number;
}
