import { Component, Inject, OnInit } from '@angular/core';
import {
  Employee,
  EmployeeCount,
  EmployeePaginatedBody,
} from '../../../models/emloyee';
import { EmployeeService } from '../../../services/employee.service';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { paginatedBody } from '../../../models/department';
import { PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  public employees: Employee[] = [];
  public projectEmployees: { id: number; name: string }[] = [];
  public paginationData: EmployeePaginatedBody = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: '',
    sortedOrder: 0,
    search: '',
    dateRange: null,
    status: null,
  };
  public employeeCount: EmployeeCount | null = null;
  public isAdding = false;
  public totalPages = 0;
  public totalItems = 0;
  public dialogRef!: MatDialogRef<EmployeeListComponent>;
  public range: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private deleteDialogService: DeletedialogService,
    private messageService: MessageService
  ) {
    this.getPaginationList();
    this.range = new FormGroup({
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Subscribe to value changes on the form group
    this.range.valueChanges.subscribe((value) => {
      this.updateDateRange(value);
    });
    this.getCount();
  }

  private updateDateRange(value: any) {
    if (value.start && value.end) {
      const { start, end } = value;
      this.paginationData.dateRange = {
        startDate: start,
        endDate: end,
      };

      console.log(this.paginationData.dateRange);

      if (this.paginationData.dateRange.endDate != null) {
        this.getPaginationList();
      }
    }
  }

  private getPaginationList() {
    this.employeeService
      .getPaginatedEmployees(this.paginationData)
      .subscribe((response) => {
        this.employees = response.data.data;
        this.totalPages = response.data.totalPages;
        this.totalItems = response.data.totalItems;
      });
  }

  private getCount(): void {
    this.employeeService
      .employeeCount()
      .subscribe((response: EmployeeCount) => {
        this.employeeCount = response;
      });
  }

  public deleteEmployee(id: number) {
    this.deleteDialogService
      .openDialog()
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.employeeService.deleteEmployee(id).subscribe((data) => {
            if (data.success) {
              this.getPaginationList();
              console.log('hi');
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Department Deleted Successfully',
              });
            }
          });
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
    } else if (event.direction === 'desc') {
      this.paginationData.sortedOrder = 0;
    } else {
      this.paginationData.sortedOrder = 2;
    }
    this.getPaginationList();
  }

  public addEmployeeInProject(name: string, id: number) {
    const employee = { id, name };
    this.projectEmployees.push(employee);
  }

  public removeEmployeeInProject(id: number) {
    this.projectEmployees = this.projectEmployees.filter(
      (emp) => emp.id !== id
    );
  }

  public exsistInArray(id: number): boolean {
    return this.projectEmployees.some((emp) => emp.id === id);
  }

  public saveProjectEmployees(): void {
    this.dialogRef.close(this.projectEmployees);
  }

  public changeStatus(val: number | null): void {
    this.paginationData.status = val;
    this.getPaginationList();
  }
}
