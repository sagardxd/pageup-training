import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { departmentData, departments } from '../../../models/department';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../deparment-dialog/dialog/dialog.component';


@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent implements OnInit {

  public departments: departmentData[] = [];

  constructor(private departmentService: DepartmentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getDepartment();
  }

  getDepartment(): void {
    this.departmentService.getDepartment().subscribe((response: departments) => {
      this.departments = response.data;
      console.log(this.departments);
    });
  }

  addDepartment(): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      'enterAnimationDuration': '0ms',
      'exitAnimationDuration': '0ms',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDepartment();
      }
    });
  }

  deleteDepartment(id: number): void {
    this.departmentService.deleteDepartment(id).subscribe((response) => {
      if (response.success) {
        this.departments = this.departments.filter((department) => department.id !== id);
        alert('Deleted department');
      }
    });
  }

}
