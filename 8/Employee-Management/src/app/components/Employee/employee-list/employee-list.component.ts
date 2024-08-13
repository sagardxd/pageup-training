import { Component, Inject } from '@angular/core';
import { Employee } from '../../../models/emloyee';
import { EmployeeService } from '../../../services/employee.service';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { paginatedBody } from '../../../models/department';
import { PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})


export class EmployeeListComponent {

  public employees: Employee[] = [];
  public projectEmployees: { id: number, name: string }[] = [];

  public paginationData: paginatedBody = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: "",
    sortedOrder: 0,
    search: ""
  }

  public isAdding = false;

  public totalPages = 0;
  public totalItems = 0;

  public dialogRef!: MatDialogRef<EmployeeListComponent>;

  constructor(private employeeService: EmployeeService,
    private deleteDialogService: DeletedialogService,
  ) {
    this.getPaginationList();
  }

  private getPaginationList() {
    this.employeeService.getPaginatedEmployees(this.paginationData).subscribe((response) => {
      this.employees = response.data.data;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    });
  }

  public deleteEmployee(id: number) {
    this.deleteDialogService.openDialog().afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(id).subscribe((data) => {
          if (data.success) {
            this.getPaginationList();
          }
        })
      }
    });
  }



  public onPageEvent(event: PageEvent): void {
    this.paginationData.pageIndex = event.pageIndex + 1;
    this.paginationData.pagedItemsCount = event.pageSize;
    this.getPaginationList();
  }


  public handleSearch(): void {
    this.getPaginationList();
  }

  public sortData(event: any): void {
    console.log(event.active);
    console.log(event.direction);
    this.paginationData.orderKey = event.active;

    if (event.direction === 'asc') {
      this.paginationData.sortedOrder = 1;
    }
    else if (event.direction === 'desc') {
      this.paginationData.sortedOrder = 0;
    }
    else {
      this.paginationData.sortedOrder = 2;
    }

    this.getPaginationList();
  }

  public addEmployeeInProject(name: string, id: number) {
    const employee = { id, name };
    this.projectEmployees.push(employee);
  }

  public removeEmployeeInProject(id: number) {
    this.projectEmployees = this.projectEmployees.filter(emp => emp.id !== id);
  }

  public exsistInArray(id: number): boolean {
    return this.projectEmployees.some(emp => emp.id === id);
  }

  public saveProjectEmployees() {
    this.dialogRef.close(this.projectEmployees);
  }
}
