import { Component, OnInit } from '@angular/core';
import {
  ParentTask,
  parentTaskList,
  subTasks,
  TaskById,
  TaskByIdResponse,
  TaskByProjectIdAndTasktypeResponse,
  TaskLogResponse,
  TaskMessage,
  TaskReview,
  TaskReviewResponse,
  TaskStatus,
  TaskType,
} from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent implements OnInit {
  public task: TaskById | null = null;
  public taskLogs: TaskMessage[] = [];
  private paramId: string | null = null;
  public taskReviews: TaskReview[] = [];
  public newReviewContent = '';
  public subTasks: subTasks[] = [];
  public parent: ParentTask | null = null;
  public selectedParent: number | null = null;
  public changeParentsList: parentTaskList[] | null = null;
  public isChangingParent = false;
  public isRequesting = false;
  public userId: number | null = null;
  public showTasklogs = false;
  public taskReviewAboutToEdit: number | null = null;
  public taskReviewContent = new FormControl<string | null>(null, [
    Validators.required,
  ]);

  public changeParentId = new FormControl<number | null>(null, [
    Validators.required,
  ]);

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('id'));
    this.activatedRoute.paramMap.subscribe((params) => {
      this.paramId = params.get('id');
      if (this.paramId) {
        this.getTaskById();
        this.getTaskLogs();
      }
    });
  }

  private getTaskById(): void {
    if (this.paramId) {
      this.taskService
        .getTaskById(Number(this.paramId))
        .subscribe((result: TaskByIdResponse) => {
          if (result.success) {
            console.log(result);
            this.task = result.data.task;
            this.taskReviews = result.data.reviews || [];
            this.subTasks = result.data.subTasks || [];
            if (result.data.parent != null) {
              this.parent = result.data.parent;
            } else {
              this.parent = null;
            }
            console.log(result);
          } else {
            console.error('Failed to fetch task:', result.message);
          }
        });
    }
  }

  public addReview(): void {
    const body = {
      content: this.newReviewContent,
    };
    this.taskService
      .addReview(Number(this.paramId), body)
      .subscribe((result: TaskReviewResponse) => {
        if (result.success) {
          this.newReviewContent = '';
          this.getTaskById();
        } else {
          console.error('Failed to add review:', result.message);
        }
      });
  }

  public editTask(): void {
    console.log('ey');
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.projectId = this.task?.projectId;
    dialogRef.componentInstance.taskId = Number(this.paramId);
    dialogRef.componentInstance.getTaskDetails(Number(this.paramId));
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  private getTaskLogs(): void {
    this.taskService
      .getTaskLog(Number(this.paramId))
      .subscribe((response: TaskLogResponse) => {
        this.taskLogs = response.data;
      });
  }

  public editParent(): void {
    this.isChangingParent = true;
    let val;
    if (this.parent) {
      val = this.parent.taskType;
    }
    try {
      console.log('this-task', this.task, val);
      if (this.task) {
        if (val !== undefined)
          this.taskService
            .getTaskByProjectIdAndTasktype(this.task?.projectId, val)
            .subscribe((response: TaskByProjectIdAndTasktypeResponse) => {
              this.changeParentsList = response.data;
            });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public cancelEditParent() {
    this.isChangingParent = false;
    this.selectedParent = null;
  }

  public redirectTask(id: number): void {
    this.router.navigate(['/task/view', id]);
    this.isChangingParent = false;
  }

  public changeParentTask(taskId: number | undefined) {
    if (this.changeParentId.value && taskId) {
      this.taskService
        .changeParentId(taskId, this.changeParentId.value)
        .subscribe((res) => {
          this.isChangingParent = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Updated',
            detail: 'Updated Comment Successfully',
          });
          this.getTaskById();
        });
    }
  }

  public editTaskReview(id: number, content: string): void {
    this.taskReviewAboutToEdit = id;
    this.taskReviewContent.setValue(content);
  }

  public editTaskReviewContent() {
    if (
      this.taskReviewContent.value != null &&
      this.taskReviewAboutToEdit != null
    )
      this.taskService
        .editTaskReview(
          this.taskReviewContent.value,
          this.taskReviewAboutToEdit
        )
        .subscribe(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Updated',
            detail: 'Updated Comment Successfully',
          });
          this.taskReviewAboutToEdit = null;
          this.getTaskById();
        });
  }
}
