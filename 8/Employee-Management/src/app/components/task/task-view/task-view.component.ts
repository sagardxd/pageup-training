import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
} from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent implements OnInit, OnDestroy {
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
  public showMoreToggle = true;
  public hasChanged: boolean | null = null;
  public taskReviewContent = new FormControl<string | null>(null, [
    Validators.required,
  ]);

  public changeParentId = new FormControl<number | null>(null, [
    Validators.required,
  ]);
  private subscriptions: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('id'));
    this.subscriptions.add(
      this.activatedRoute.paramMap.subscribe({
        next: (params) => {
          this.paramId = params.get('id');
          if (this.paramId) {
            this.getTaskById();
            this.getTaskLogs();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Getting ParamId',
          });
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    if (this.hasChanged) {
      $event.preventDefault();
    }
  }

  private getTaskById(): void {
    if (this.paramId) {
      this.subscriptions.add(
        this.taskService.getTaskById(Number(this.paramId)).subscribe({
          next: (result: TaskByIdResponse) => {
            if (result.success) {
              this.task = result.data.task;
              this.taskReviews = result.data.reviews || [];
              this.subTasks = result.data.subTasks || [];
              if (result.data.parent != null) {
                this.parent = result.data.parent;
              } else {
                this.parent = null;
              }
            } else {
              console.error('Failed to fetch task:', result.message);
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Fetching Task Details',
            });
          },
        })
      );
    }
  }

  public addReview(): void {
    const body = {
      content: this.newReviewContent,
    };
    this.subscriptions.add(
      this.taskService.addReview(Number(this.paramId), body).subscribe({
        next: (result: TaskReviewResponse) => {
          if (result.success) {
            this.newReviewContent = '';
            this.getTaskById();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Adding Review',
          });
        },
      })
    );
  }

  public editTask(): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
    });

    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.projectId = this.task?.projectId;
    dialogRef.componentInstance.taskId = Number(this.paramId);
    dialogRef.componentInstance.getTaskDetails(Number(this.paramId));
    this.subscriptions.add(
      dialogRef.componentInstance.hasUnsavedChanges.subscribe(
        (hasChanged: boolean) => {
          this.hasChanged = hasChanged;
          console.log(hasChanged);
        }
      )
    );

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(() => {
        this.hasChanged = false;
        this.ngOnInit();
      })
    );
  }

  public getTaskLogs(): void {
    this.subscriptions.add(
      this.taskService
        .getTaskLog(Number(this.paramId), this.taskLogs.length)
        .subscribe({
          next: (response: TaskLogResponse) => {
            if (response.data.remaining === 0) {
              console.log(this.showMoreToggle);
              this.showMoreToggle = false;
            }
            if (this.taskLogs.length === 0) {
              this.taskLogs = response.data.logs;
            } else {
              this.taskLogs = [...this.taskLogs, ...response.data.logs];
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Fetching TaskLogs',
            });
          },
        })
    );
  }

  public editParent(): void {
    this.isChangingParent = true;
    let val;
    if (this.parent) {
      val = this.parent.taskType;
    }
    if (this.task) {
      if (val !== undefined)
        this.subscriptions.add(
          this.taskService
            .getTaskByProjectIdAndTasktype(this.task?.projectId, val)
            .subscribe({
              next: (response: TaskByProjectIdAndTasktypeResponse) => {
                this.changeParentsList = response.data;
              },
              error: (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error Fetching Parents Details',
                });
              },
            })
        );
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
      this.subscriptions.add(
        this.taskService
          .changeParentId(taskId, this.changeParentId.value)
          .subscribe({
            next: (res) => {
              this.isChangingParent = false;
              this.messageService.add({
                severity: 'info',
                summary: 'Updated',
                detail: 'Updated Parent Successfully',
              });
              this.getTaskById();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error Updating Parent',
              });
            },
          })
      );
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
      this.subscriptions.add(
        this.taskService
          .editTaskReview(
            this.taskReviewContent.value,
            this.taskReviewAboutToEdit
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Updated',
                detail: 'Updated Comment Successfully',
              });
              this.taskReviewAboutToEdit = null;
              this.getTaskById();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error Updating Comment',
              });
            },
          })
      );
  }
}
