import { Component, OnInit } from '@angular/core';
import { paginatedBody } from '../../../models/department';
import { PageEvent } from '@angular/material/paginator';
import { TaskService } from '../../../services/task.service';
import { paginatedTaskData, Tasks } from '../../../models/task';
import { Task } from '../../../models/project';
import { DeletedialogService } from '../../../services/deletedialog.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  public tasks: Tasks[] = [];

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

  constructor(
    private taskService: TaskService,
    private deletedialogService: DeletedialogService
  ) {}

  ngOnInit(): void {
    this.getPaginatedTaskList();
  }

  private getPaginatedTaskList() {
    this.taskService
      .getPaginatedTasks(this.paginationData)
      .subscribe((response: paginatedTaskData) => {
        this.tasks = response.data.data;
        this.totalPages = response.data.totalPages;
        this.totalItems = response.data.totalItems;
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
}
