import { Component, inject, OnInit } from '@angular/core';
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
import { EmployeeListComponent } from '../../../modules/employee/employee-list/employee-list.component';
import { WorkItem } from '../../task/task-tree/task-tree.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SprintService } from '../../../services/sprint.service';
import {
  Sprint,
  sprintByIdResponse,
  sprintGetBody,
  sprintPostBody,
} from '../../../models/sprint';
import { MatSelectChange } from '@angular/material/select';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TaskCount, TaskPaginationBodyTask } from '../../../models/task';
import { MessageService } from 'primeng/api';
import { DeletedialogService } from '../../../services/deletedialog.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss',
})
export class ProjectViewComponent implements OnInit {
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
  private sprintId = 0;

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
    this.range.valueChanges.subscribe((value) => {
      this.updateDateRange(value);
    });
    this.getTaskCount();
  }

  public addSprint() {
    const data: sprintPostBody = {
      name: this.sprintForm.controls.name.value ?? null,
      startDate: this.sprintForm.controls.startDate.value ?? null,
      endDate: this.sprintForm.controls.endDate.value ?? null,
      projectId: Number(this.paramId),
    };

    this.sprintService.createSprint(data, 0).subscribe((response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: 'Added Sprint Successfully',
      });
      this.sprintForm.reset();
      this.ngOnInit();
    });
  }

  public sprintForm = new FormGroup({
    name: new FormControl<string | null>('', [Validators.required]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null, [Validators.required]),
  });

  private getTaskCount(): void {
    this.taskService.getTaskCount().subscribe((response: TaskCount) => {
      this.taskCount = response;
      this.setTaskCountVal();
    });
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
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.paramId = paramMap.get('id') ?? '';
      if (this.paramId) {
        this.getProjectData();
        this.getTasks();
        this.getSprints();
      }
    });
  }

  private getSprints(): void {
    this.sprintService
      .getSprintsByProjectId(Number(this.paramId))
      .subscribe((response: sprintGetBody) => {
        this.sprints = response.data;
      });
  }

  private getTasks(): void {
    this.taskService
      .getEpicTasks(Number(this.paramId), this.paginationData)
      .subscribe((response) => {
        if (response.success) {
          this.epicList = response.data.data;
          this.totalItems = response.data.totalItems;
        }
      });
  }

  private getProjectData(): void {
    this.projectService
      .getProjectById(Number(this.paramId))
      .subscribe((response: projectByIdResponse) => {
        if (response.success) {
          this.project = response.data;
        }
      });
  }

  public handleTaskUpdated(): void {
    this.getTasks();
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
      this.getTasks();
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

    dialogRef.afterClosed().subscribe((result) => {
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

    this.projectService
      .updateProject(Number(this.paramId), projectData)
      .subscribe((response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Updated Employee Successfully',
          });
          this.hasChanged = false;
          this.getProjectData();
        }
      });
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

  public updateSprint(id: number): void {
    this.sprintService
      .getSprintById(id)
      .subscribe((res: sprintByIdResponse) => {
        this.sprintForm.setValue({
          name: res.data.name,
          startDate: res.data.startDate,
          endDate: res.data.endDate,
        });
        console.log(res.data);
        this.sprintId = res.data.id;
        console.log(this.sprintId);
      });

    this.updating = true;
  }

  public updateSprintData() {
    console.log(this.sprintId);
    const data: sprintPostBody = {
      name: this.sprintForm.controls.name.value ?? null,
      startDate: this.sprintForm.controls.startDate.value ?? null,
      endDate: this.sprintForm.controls.endDate.value ?? null,
      projectId: Number(this.paramId),
    };

    this.sprintService
      .createSprint(data, this.sprintId)
      .subscribe((response) => {
        this.messageService.add({
          severity: 'info',
          summary: 'updated',
          detail: 'Updated Sprint Successfully',
        });
        this.sprintForm.reset();
        this.getSprints();
      });
  }

  public deleteSprint(id: number): void {
    this.deleteDialogService
      .openDialog()
      .afterClosed()
      .subscribe((result) => {
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
      });
    //
  }
}
