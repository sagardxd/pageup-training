import { Component, OnInit } from '@angular/core';
import {
  ParentTask,
  subTasks,
  TaskById,
  TaskByIdResponse,
  TaskLogResponse,
  TaskMessage,
  TaskReview,
  TaskReviewResponse,
  TaskStatus,
  TaskType,
} from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';

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

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
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
            this.task = result.data.task;
            this.taskReviews = result.data.reviews || [];
            this.subTasks = result.data.subTasks || [];
            if (result.data.parent) {
              this.parent = result.data.parent;
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
}
