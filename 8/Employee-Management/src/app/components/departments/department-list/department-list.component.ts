import { Component, OnDestroy, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import {
  departmentData,
  paginatedBody,
  paginatedDepartmentData,
} from '../../../models/department';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RequestHandlerService } from '../../../services/request-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit, OnDestroy {
  public departments: departmentData[] = [];
  public paginationData: paginatedBody = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: '',
    sortedOrder: 0,
    search: '',
    dateRange: null,
  };
  public totalPages = 0;
  public totalItems = 0;
  public range: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private deleteDialogService: DeletedialogService,
    private messageService: MessageService,
    private requestHandler: RequestHandlerService
  ) {
    this.range = new FormGroup({
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getPaginationList();

    // Subscribe to value changes on the form group
    this.subscriptions.add(
      this.range.valueChanges.subscribe((value) => {
        this.updateDateRange(value);
      })
    );
  }

  private updateDateRange(value: any) {
    if (value.start && value.end) {
      const { start, end } = value;
      this.paginationData.dateRange = {
        startDate: start,
        endDate: end,
      };

      if (this.paginationData.dateRange.endDate != null) {
        this.getPaginationList();
      }
    }
  }

  private getPaginationList(): void {
    this.subscriptions.add(
      this.departmentService
        .getPaginatedDepartment(this.paginationData)
        .subscribe((response: paginatedDepartmentData) => {
          this.departments = response.data.data;
          this.totalPages = response.data.totalPages;
          this.totalItems = response.data.totalItems;
        })
    );
  }

  public invokeAddDepartmentDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
    });
    dialogRef.componentInstance.dialog = dialogRef;
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result) {
            this.getPaginationList();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Adding',
          });
        },
      })
    );
  }

  public deleteDepartmentDialog(id: number): void {
    this.subscriptions.add(
      this.deleteDialogService
        .openDialog()
        .afterClosed()
        .subscribe({
          next: (result) => {
            if (result) {
              this.deleteDepartment(id);
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Deleting',
            });
          },
        })
    );
  }

  private deleteDepartment(id: number): void {
    this.subscriptions.add(
      this.departmentService.deleteDepartment(id).subscribe((response) => {
        if (response.success) {
          this.departments = this.departments.filter(
            (department) => department.id !== id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Department Deleted Successfully',
          });
          this.getPaginationList();
        }
      })
    );
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
