import { ApiResponse } from './commonModels';
import { EmployeeRole } from './emloyee';

export interface LoginResponse extends ApiResponse {
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
