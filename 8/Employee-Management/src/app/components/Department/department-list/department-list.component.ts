import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { departmentData, departments, paginatedBody, paginatedDepartmentData, paginatedDepartmentDataList } from '../../../models/department';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../deparment-dialog/dialog/dialog.component';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent implements OnInit {

  public departments: departmentData[] = [];
  public paginationData: paginatedBody = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: "",
    sortedOrder: 0,
    search: ""
  }

  public totalPages = 0;
  public totalItems = 0;

  constructor(private departmentService: DepartmentService,
    private dialog: MatDialog, private deleteDialogService: DeletedialogService
  ) { }

  ngOnInit(): void {
    // this.getDepartment();
    this.getPaginationList();
  }

  private getPaginationList() {
    this.departmentService.getPaginatedDepartment(this.paginationData).subscribe((response: paginatedDepartmentData) => {
      this.departments = response.data.data;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    });
  }

  public addDepartment(): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      'enterAnimationDuration': '0ms',
      'exitAnimationDuration': '0ms',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPaginationList();
      }
    });
  }

  public deleteDepartment(id: number): void {

    this.deleteDialogService.openDialog().afterClosed().subscribe(result => {
      if (result) {
        this.departmentService.deleteDepartment(id).subscribe((response) => {
          if (response.success) {
            this.departments = this.departments.filter((department) => department.id !== id);
            this.getPaginationList();
          }
        });
      }
    });
  }

  public onPageEvent(event: PageEvent): void {
    if (event.pageSize != this.paginationData.pagedItemsCount) {
      this.paginationData.pageIndex = 1;
    } else {
      this.paginationData.pageIndex = event.pageIndex + 1;

    }
    this.paginationData.pagedItemsCount = event.pageSize;
    this.getPaginationList();
  }


  public handleSearch(): void {
    this.getPaginationList();
  }

  public sortData(event: any): void {
    console.log(event.page);
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

}