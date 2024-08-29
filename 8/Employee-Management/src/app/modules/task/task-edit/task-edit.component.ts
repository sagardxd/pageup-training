import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  TaskForm,
  Tasks,
  TaskStatus,
  TaskByIdResponse,
  TaskType,
  TasUpdatetBody,
  TaskById,
} from '../../../models/task';
import {
  Employee,
  projectByIdData,
  projectByIdResponse,
} from '../../../models/project';
import { TaskService } from '../../../services/task.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SprintService } from '../../../services/sprint.service';
import { Sprint, sprintGetBody } from '../../../models/sprint';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnInit {
  public Task: Tasks | null = null;
  public parentId: number | null = null;
  public TaskStatus = TaskStatus;
  public projectName = '';
  public projectId: number | undefined;
  public assignedTo: Employee[] | undefined = [];
  public dialogRef!: MatDialogRef<TaskEditComponent>;
  public paramId: string | null = null;
  public project: projectByIdData | null = null;
  public sprints: Sprint[] = [];
  public isEdit = false;
  public taskId: number | null = null;

  public taskTypeLabels: { [key: number]: string } = {
    0: 'Epic',
    1: 'Feature',
    2: 'Userstory',
    3: 'Task',
    4: 'Bug',
  };

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private sprintService: SprintService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.projectId) {
      this.getSprints(this.projectId);
    }
  }

  public getTaskTypeLabel(taskTypeValue: number | null): string {
    return this.taskTypeLabels[taskTypeValue ?? 0];
  }

  public taskForm = new FormGroup<TaskForm>(
    {
      name: new FormControl<string | null>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl<string | null>('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      assignedTo: new FormControl<number | null>(null),
      sprintId: new FormControl<number | null>(null),
      taskType: new FormControl<TaskType | null>(null, [Validators.required]),
      parentId: new FormControl<number | null>(null),
      projectId: new FormControl<number | null>(null),
      status: new FormControl<TaskStatus | null>(TaskStatus.Pending),
      originalEstimateHours: new FormControl<number | null>(null),
      remainingEstimatedHours: new FormControl<number | null>(null),
    },
    {
      validators: this.remainingHoursValidator(),
    }
  );

  remainingHoursValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const originalEstimate = formGroup.get('originalEstimateHours')?.value;
      const remainingEstimate = formGroup.get('remainingEstimatedHours')?.value;

      if (
        originalEstimate &&
        remainingEstimate &&
        remainingEstimate > originalEstimate
      ) {
        return { remainingHoursExceedsOriginal: true };
      }
      return null;
    };
  }

  public addTask(): void {
    if (this.taskForm.value.name && this.taskForm.value.description) {
      const TaskData = {
        name: this.taskForm.value.name,
        description: this.taskForm.value.description,
        assignedTo: Number(this.taskForm.value.assignedTo),
        sprintId: Number(this.taskForm.value.sprintId),
        taskType: Number(this.taskForm.value.taskType),
        parentId: this.taskForm.value.parentId! || null,
        projectId: Number(this.projectId || this.paramId),
        status: this.taskForm.value.status!,
        originalEstimateHours: this.taskForm.value.originalEstimateHours || 0,
      };
      console.log('hi');
      try {
        this.taskService.postTask(TaskData).subscribe((response) => {
          if (response) {
            this.dialogRef.close(true);
            this.messageService.add({
              severity: 'success',
              summary: 'Added',
              detail: 'Added Task Successfully',
            });
          }
        });
        console.log(TaskData);
      } catch (error) {
        console.log(error);
      }
    }
  }

  public getTaskDetails(id: number): void {
    this.taskService.getTaskById(id).subscribe((response: TaskByIdResponse) => {
      if (response) {
        if (response.data.parent) {
          this.parentId = response.data.parent.id;
        }

        if (this.projectId) {
          this.projectService
            .getProjectById(this.projectId)
            .subscribe((response: projectByIdResponse) => {
              if (response.success) {
                console.log('response', response);
                this.project = response.data;
                if (this.projectId) {
                  this.getSprints(this.projectId);
                }
              }
            });
        }
        console.log(response.data.task);
        if (response.data.task) {
          this.taskForm.patchValue({
            name: response.data.task.name,
            description: response.data.task.description,
            status: response.data.task.status,
            projectId: response.data.task.projectId,
            taskType: response.data.task.taskType,
            assignedTo: response.data.task.assignedTo,
            sprintId: response.data.task.sprintId,
            originalEstimateHours: response.data.task.originalEstimateHours,
            remainingEstimatedHours: response.data.task.remainingEstimateHours,
          });
        }
      }
    });
  }

  private getSprints(id: number): void {
    this.sprintService
      .getSprintsByProjectId(id)
      .subscribe((response: sprintGetBody) => {
        this.sprints = response.data;
      });
  }

  public updateTask(): void {
    if (this.taskForm.value.name && this.taskForm.value.description) {
      const TaskData: TasUpdatetBody = {
        name: this.taskForm.value.name,
        description: this.taskForm.value.description,
        assignedTo: Number(this.taskForm.value.assignedTo),
        sprintId: Number(this.taskForm.value.sprintId),
        taskType: Number(this.taskForm.value.taskType!),
        parentId: this.parentId || null,
        projectId: Number(this.projectId || this.paramId),
        status: this.taskForm.value.status!,
        originalEstimateHours: this.taskForm.value.originalEstimateHours,
        remainingEstimateHours: this.taskForm.value.remainingEstimatedHours,
      };

      try {
        if (this.taskId)
          this.taskService
            .updateTask(TaskData, this.taskId)
            .subscribe((response: any) => {
              if (response) {
                if (this.dialogRef) {
                  this.dialogRef.close(true);
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Updated Task',
                    detail: 'Updated Task Successfully',
                  });
                }
              }
            });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
