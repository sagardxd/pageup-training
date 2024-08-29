import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TaskService } from '../../../services/task.service';
import {
  TaskPaginationBodyTask,
  taskpaginationData,
  TaskPaginationResponse,
} from '../../../models/task';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  public tasks: taskpaginationData[] = [];
  public projectId: number = 0;
  public dialogref: any = null;

  public paginationData: TaskPaginationBodyTask = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: '',
    sortedOrder: 0,
    search: '',
    dateRange: null,
    types: null,
    status: null,
    assign: null,
    assignedTo: null,
    sprintId: null,
  };

  public totalPages = 0;
  public totalItems = 0;

  constructor(
    private taskService: TaskService,
    private deletedialogService: DeletedialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPaginatedTaskList();
  }

  private getPaginatedTaskList() {
    this.taskService
      .getEpicTasks(this.projectId, this.paginationData)
      .subscribe((response: TaskPaginationResponse) => {
        if (response.success) {
          this.tasks = response.data.data;
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
        }
      });
  }

  public onPageEvent(event: PageEvent): void {
    this.paginationData.pageIndex = event.pageIndex + 1;
    this.paginationData.pagedItemsCount = event.pageSize;
    this.getPaginatedTaskList();
  }

  public handleSearch(): void {
    this.getPaginatedTaskList();
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
    this.getPaginatedTaskList();
  }

  public deleteTask(id: number) {
    this.deletedialogService
      .openDialog()
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.taskService.deleteTask(id).subscribe(() => {
            this.getPaginatedTaskList();
          });
        }
      });
  }

  public redirectToTask(id: number) {
    this.dialogref.close();
    this.router.navigate(['/task/view', id]);
  }
}
