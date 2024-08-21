import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import {
  projectByIdData,
  projectByIdResponse,
  ProjectStatus,
} from '../../../models/project';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../../Task/task-edit/task-edit.component';
import { TaskService } from '../../../services/task.service';
import { EmployeeListComponent } from '../../Employee/employee-list/employee-list.component';
import { WorkItem } from '../../Task/task-tree/task-tree.component';
import { TaskPaginationBody } from '../../../models/task';
import { PageEvent } from '@angular/material/paginator';
import { updateEmployee } from '../../../models/emloyee';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss',
})
export class ProjectViewComponent implements OnInit {
  public paramId = '';
  public project: projectByIdData | null = null;
  public epicList: WorkItem[] = [];
  public paginationData: TaskPaginationBody = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: '',
    sortedOrder: 0,
    search: '',
    filters: null,
  };
  public totalItems = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.getParamId();
  }

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.paramId = paramMap.get('id') ?? '';
      if (this.paramId) {
        this.getProjectData();
        this.getEpicTasks();
      }
    });
  }

  private getEpicTasks(): void {
    this.taskService
      .getEpicTasks(this.paramId, this.paginationData)
      .subscribe((response) => {
        if (response.success) {
          this.epicList = response.data.data;
          this.totalItems = response.data.totalItems;
        }
      });
  }

  private getProjectData(): void {
    console.log('refreshing project data');
    this.projectService
      .getProjectById(Number(this.paramId))
      .subscribe((response: projectByIdResponse) => {
        if (response.success) {
          this.project = response.data;
          console.log(response.data);
        }
      });
  }

  public handleTaskUpdated(): void {
    console.log('heyerer');
    this.ngOnInit();
  }

  public createTask(): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.componentInstance.projectName = this.project?.name ?? '';
    dialogRef.componentInstance.assignedTo = this.project?.members;
    dialogRef.componentInstance.projectId = this.project?.id;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe((result) => {
      this.getEpicTasks();
    });
  }

  public deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe((response) => {
      if (response) {
        alert('Task Deleted Successfully');
        this.getProjectData();
      }
    });
  }

  public removeEmployee(id: number): void {
    this.project?.members?.splice(
      this.project.members.findIndex((member) => member.employeeId === id),
      1
    );
  }

  public addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeListComponent, {
      width: '1000px',
      height: '600px',
    });

    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.isAdding = true;
    dialogRef.componentInstance.projectEmployees =
      this.project?.members?.map((member) => ({
        id: member.employeeId,
        name: member.employeeName,
      })) ?? [];

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newMembers = result.map((employee: any) => ({
          employeeId: employee.id,
          employeeName: employee.name,
        }));

        this.project!.members = newMembers;
      }
    });
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
  }

  public onPageEvent(event: PageEvent): void {
    this.paginationData.pageIndex = event.pageIndex + 1;
    this.paginationData.pagedItemsCount = event.pageSize;
    this.getEpicTasks();
  }

  public updateEmployee(): void {
    console.log('clicked');
    const projectData = {
      name: this.project?.name ?? '',
      description: this.project?.description ?? '',
      status: this.project?.status ?? 0,
      members:
        this.project?.members?.map((member) => ({
          employeeId: member.employeeId,
        })) ?? [],
    };

    this.projectService
      .updateProject(Number(this.paramId), projectData)
      .subscribe((response) => {
        if (response.success) {
          alert('Employee Removed Successfully');
          this.getProjectData();
        }
      });
  }

  public getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Pending:
        return 'Pending';
      case ProjectStatus.Active:
        return 'Active';
      case ProjectStatus.Completed:
        return 'Completed';
      default:
        return '';
    }
  }
}
