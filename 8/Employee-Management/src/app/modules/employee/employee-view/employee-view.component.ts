import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Employee, EmployeeById } from '../../../models/emloyee'

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss'
})


export class EmployeeViewComponent implements OnInit {

  private paramId = '';
  public employee: Employee | null = null;

  constructor(private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.getParamId();
  }

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id')) ?? '';
      if (this.paramId) {
        this.getEmployeeData();
      }
    });
  }

  private getEmployeeData() {
    this.employeeService.getEmployeeById(Number(this.paramId)).subscribe((response: EmployeeById) => {
      if (response.success) {
        this.employee = response.data;
        console.log(response.data)
      }
    });
  }
}
