import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import {
  projectByIdData,
  projectByIdResponse,
  ProjectStatus,
} from '../../../models/project';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../../task/task-edit/task-edit.component';
import { TaskService } from '../../../services/task.service';
import { EmployeeListComponent } from '../../../components/employee/employee-list/employee-list.component';
import { WorkItem } from '../../task/task-tree/task-tree.component';
import { PageEvent } from '@angular/material/paginator';
import { SprintService } from '../../../services/sprint.service';
import { Sprint, sprintGetBody } from '../../../models/sprint';
import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskCount, TaskPaginationBodyTask } from '../../../models/task';
import { MessageService } from 'primeng/api';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { AddSprintComponent } from '../../task/add-sprint/add-sprint.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss',
})
export class ProjectViewComponent implements OnInit, OnDestroy {
  public paramId = '';
  public sprints: Sprint[] = [];
  public project: projectByIdData | null = null;
  public epicList: WorkItem[] = [];
  public hasChanged: boolean = false;
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
  public updating = false;
  public taskCount: TaskCount | null = null;
  public totalItems = 0;
  public taskTypeList: { id: number; name: string; countVal: number }[] = [
    { id: 0, name: 'Epic', countVal: 0 },
    { id: 1, name: 'Feature', countVal: 0 },
    { id: 2, name: 'Userstory', countVal: 0 },
    { id: 3, name: 'Task', countVal: 0 },
    { id: 4, name: 'Bug', countVal: 0 },
  ];
  public statusList: { id: number; name: string; countVal: number }[] = [
    { id: 0, name: 'Pending', countVal: 0 },
    { id: 1, name: 'Active', countVal: 0 },
    { id: 2, name: 'Completed', countVal: 0 },
  ];
  public assignList: { value: boolean; name: string; countVal: number }[] = [
    { value: false, name: 'Unassigned', countVal: 0 },
    { value: true, name: 'Assigned', countVal: 0 },
  ];
  public range: FormGroup;
  public isEmployee = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private taskService: TaskService,
    private sprintService: SprintService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private deleteDialogService: DeletedialogService
  ) {
    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getParamId();

    // Subscribe to value changes on the form group
    this.subscriptions.add(
      this.range.valueChanges.subscribe((value) => {
        this.updateDateRange(value);
      })
    );
    this.getTaskCount();

    if (localStorage.getItem('role') === '0') this.isEmployee = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getTaskCount(): void {
    this.subscriptions.add(
      this.taskService
        .getTaskCount(Number(this.paramId))
        .subscribe((response: TaskCount) => {
          this.taskCount = response;
          this.setTaskCountVal();
        })
    );
  }

  private setTaskCountVal(): void {
    if (this.taskCount) {
      this.taskTypeList[0].countVal = this.taskCount?.typeCount.epic;
      this.taskTypeList[1].countVal = this.taskCount?.typeCount.feature;
      this.taskTypeList[2].countVal = this.taskCount?.typeCount.userStory;
      this.taskTypeList[3].countVal = this.taskCount?.typeCount.task;
      this.taskTypeList[4].countVal = this.taskCount?.typeCount.bug;

      this.statusList[0].countVal = this.taskCount.statusCount.pending;
      this.statusList[1].countVal = this.taskCount.statusCount.active;
      this.statusList[2].countVal = this.taskCount.statusCount.completed;

      this.assignList[0].countVal = this.taskCount.assignCount.unAssigned;
      this.assignList[1].countVal = this.taskCount.assignCount.assigned;
    }
  }

  public updateDateRange(value: any) {
    const { start, end } = value;
    this.paginationData.dateRange = {
      startDate: start ? new Date(start) : null,
      endDate: end ? new Date(end) : null,
    };
  }

  private getParamId(): void {
    this.subscriptions.add(
      this.activatedRoute.paramMap.subscribe((paramMap) => {
        this.paramId = paramMap.get('id') ?? '';
        if (this.paramId) {
          this.getProjectData();
          this.getTasks();
          this.getSprints();
        }
      })
    );
  }

  private getSprints(): void {
    this.subscriptions.add(
      this.sprintService
        .getSprintsByProjectId(Number(this.paramId))
        .subscribe((response: sprintGetBody) => {
          this.sprints = response.data;
        })
    );
  }

  private getTasks(): void {
    this.subscriptions.add(
      this.taskService
        .getEpicTasks(Number(this.paramId), this.paginationData)
        .subscribe((response) => {
          if (response.success) {
            this.epicList = response.data.data;
            this.totalItems = response.data.totalItems;
          }
        })
    );
  }

  private getProjectData(): void {
    this.subscriptions.add(
      this.projectService
        .getProjectById(Number(this.paramId))
        .subscribe((response: projectByIdResponse) => {
          if (response.success) {
            this.project = response.data;
          }
        })
    );
  }

  public handleTaskUpdated(): void {
    this.getTasks();
  }

  public createTask(): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
    });

    dialogRef.componentInstance.projectName = this.project?.name ?? '';
    dialogRef.componentInstance.assignedTo = this.project?.members;
    dialogRef.componentInstance.projectId = this.project?.id;
    dialogRef.componentInstance.dialogRef = dialogRef;
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result) => {
        this.getTasks();
      })
    );
  }

  public deleteTask(id: number): void {
    this.subscriptions.add(
      this.taskService.deleteTask(id).subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Deleted Task Successfully',
            });
            this.getProjectData();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error deleting Task',
          });
        },
      })
    );
  }

  public removeEmployee(id: number): void {
    this.project?.members?.splice(
      this.project.members.findIndex((member) => member.employeeId === id),
      1
    );
    this.messageService.add({
      severity: 'info',
      summary: 'Removed',
      detail: 'Removed Employee Successfully',
    });
    this.hasChanged = true;
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

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result) {
            const newMembers = result.map((employee: any) => ({
              employeeId: employee.id,
              employeeName: employee.name,
            }));

            this.project!.members = newMembers;
            this.messageService.add({
              severity: 'info',
              summary: 'Added',
              detail: 'Added Employees Successfully',
            });
            this.hasChanged = true;
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error adding employees',
          });
        },
      })
    );
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
  }

  public onPageEvent(event: PageEvent): void {
    this.paginationData.pageIndex = event.pageIndex + 1;
    this.paginationData.pagedItemsCount = event.pageSize;
    this.getTasks();
  }

  public updateEmployee(): void {
    const projectData = {
      name: this.project?.name ?? '',
      description: this.project?.description ?? '',
      status: this.project?.status ?? 0,
      members:
        this.project?.members?.map((member) => ({
          employeeId: member.employeeId,
        })) ?? [],
    };

    this.subscriptions.add(
      this.projectService
        .updateProject(Number(this.paramId), projectData)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'Updated Project Successfully',
              });
              this.hasChanged = false;
              this.getProjectData();
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error updating Project',
            });
          },
        })
    );
  }

  public handleSearch(): void {
    this.getTasks();
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

  // Handle select change events
  public onTaskTypeChange(event: MatSelectChange): void {
    this.paginationData.types = event.value;
  }

  public onStatusChange(event: MatSelectChange): void {
    this.paginationData.status = event.value;
  }

  public onSprintChange(event: MatSelectChange): void {
    this.paginationData.sprintId = event.value;
  }

  public onAssignChange(event: MatSelectChange): void {
    this.paginationData.assign = event.value;
  }

  public onAssignToChange(event: MatSelectChange): void {
    this.paginationData.assignedTo = event.value;
  }

  public sprintById(id: number): void {
    this.router.navigate([`/task/sprint/${id}`]);
  }

  public fetchTasks(): void {
    this.getTasks();
  }

  public resetAllPaginationData(): void {
    const paginationData = {
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
  }

  public deleteSprint(id: number): void {
    this.subscriptions.add(
      this.deleteDialogService
        .openDialog()
        .afterClosed()
        .subscribe({
          next: (result) => {
            if (result) {
              this.sprintService.deleteSprint(id).subscribe((res) => {
                if (res) {
                  this.getSprints();
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'Deleted Sprint Successfully',
                  });
                }
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Deleting Sprint',
            });
          },
        })
    );
  }

  public updateSprint(sprintId: number): void {
    const dialogRef = this.dialog.open(AddSprintComponent, {
      width: '1000px',
      height: '600px',
      disableClose: true,
    });
    dialogRef.componentInstance.projectId = this.paramId;
    dialogRef.componentInstance.updating = true;
    dialogRef.componentInstance.sprintId = sprintId;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.getSprintData(sprintId);

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(() => {
        this.getSprints();
      })
    );
  }

  public addSprint(): void {
    const dialogRef = this.dialog.open(AddSprintComponent, {
      width: '1000px',
      height: '600px',
      disableClose: true,
    });
    dialogRef.componentInstance.projectId = this.paramId;
    dialogRef.componentInstance.dialogRef = dialogRef;

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(() => {
        this.getSprints();
      })
    );
  }
}
