import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { department, departmentData } from '../../../models/department';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent implements OnInit {

  public departments: departmentData[] = [];

  constructor(private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.getDepartment();
  }

  getDepartment(): void {
    this.departmentService.getDepartment().subscribe((response: department) => {
      this.departments = response.data;
      console.log(this.departments);
    });
  }

}
