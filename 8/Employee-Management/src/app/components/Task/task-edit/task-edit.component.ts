import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskForm, Tasks, TaskStatus, TaskByIdResponse, TaskType } from '../../../models/task';
import { Employee, projectByIdData, projectByIdResponse } from '../../../models/project';
import { TaskService } from '../../../services/task.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss'
})
export class TaskEditComponent implements OnInit {

  public Task: Tasks | null = null;
  public TaskStatus = TaskStatus;
  public projectName = '';
  public projectId: number | undefined;
  public assignedTo: Employee[] | undefined = [];
  public dialogRef!: MatDialogRef<TaskEditComponent>
  public paramId: string | null = null;
  public project: projectByIdData | null = null;
  public isTaskEdit = false;

  public taskTypeLabels: { [key: number]: string } = {
    0: 'Epic',
    1: 'Feature',
    2: 'Userstory',
    3: 'Task',
    4: 'Bug'
  };

  constructor(private taskService: TaskService,
    private activatedRoute: ActivatedRoute, private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.getParamId();
  }

  public getTaskTypeLabel(taskTypeValue: number | null): string {
    return this.taskTypeLabels[taskTypeValue ?? 0];
  }

  public taskForm = new FormGroup<TaskForm>({
    name: new FormControl<string | null>(''),
    description: new FormControl<string | null>(''),
    assignedTo: new FormControl<number | null>(null),
    taskType: new FormControl<TaskType | null>(null),
    parentId: new FormControl<number | null>(null),
    projectId: new FormControl<number | null>(null),
    status: new FormControl<TaskStatus | null>(TaskStatus.Pending)
  });

  private getParamId(): void {
    this.activatedRoute.params.subscribe(params => {
      this.paramId = params['id'];
      if (this.paramId) {
        this.getTaskDetails();
      }
    });
  }

  public addTask(): void {

    if (
      this.taskForm.value.name && this.taskForm.value.description
    ) {
      const TaskData = {
        name: this.taskForm.value.name,
        description: this.taskForm.value.description,
        assignedTo: Number(this.taskForm.value.assignedTo),
        taskType: Number(this.taskForm.value.taskType!),
        parentId: this.taskForm.value.parentId! || 0,
        projectId: Number(this.projectId || this.paramId),
        status: this.taskForm.value.status!
      }

      try {
        this.taskService.postTask(TaskData).subscribe(response => {
          if (response) {
            alert('Task Added Successfully');
            this.dialogRef.close(true);
          }
        });
        console.log(TaskData)
      } catch (error) {
        console.log(error)
      }
    }
    else {
      alert('Something went wrong');
    }
  }

  public getTaskDetails(): void {
    if (this.paramId) {
      this.taskService.getTaskById(Number(this.paramId)).subscribe((response: TaskByIdResponse) => {
        if (response) {
          console.log(response)

          this.projectService.getProjectById(Number()).subscribe((response: projectByIdResponse
          ) => {
            if (response.success) {
              this.project = response.data;
              console.log(response)
            }
          });


          if (response.data.task) {
            this.taskForm.patchValue({
              name: response.data.task.name,
              description: response.data.task.description,
              // assignedTo: this.project?.members,
              status: response.data.task.status
            });
          }
        }
      });
    }
  }
}
