import { EmployeeRole } from './emloyee';

export interface LoginResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    employee: {
      id: number;
      name: string;
      role: EmployeeRole;
      isManager: boolean;
    };
    token: string;
  };
}
