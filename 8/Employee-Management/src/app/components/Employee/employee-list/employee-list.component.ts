import { Component } from '@angular/core';
import { Employee } from '../../../models/emloyee';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {

  public employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {
    this.getEmployees();
  }

  private getEmployees() {
    this.employeeService.getEmolpyees().subscribe((data) => {
      this.employees = data.data;
    });
  }
}
