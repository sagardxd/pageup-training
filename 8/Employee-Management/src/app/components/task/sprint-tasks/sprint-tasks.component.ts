import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SprintService } from '../../../services/sprint.service';
import { sprintTaskResponse, sprintTasks } from '../../../models/sprint';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskStatus } from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sprint-tasks',
  templateUrl: './sprint-tasks.component.html',
  styleUrl: './sprint-tasks.component.scss',
})
export class SprintTasksComponent implements OnInit, OnDestroy {
  private paramId = '';
  public sprintTasks: sprintTasks[] | null = null;
  public pendingTasks: sprintTasks[] = [];
  public activeTasks: sprintTasks[] = [];
  public completedTasks: sprintTasks[] = [];
  private movedTo = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private sprintService: SprintService,
    private taskService: TaskService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getParamId();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getParamId(): void {
    this.subscriptions.add(
      this.activatedRoute.paramMap.subscribe((paramMap) => {
        this.paramId = paramMap.get('id') ?? '';
        if (this.paramId) {
          this.getSprintTasks();
        }
      })
    );
  }

  private getSprintTasks(): void {
    this.subscriptions.add(
      this.sprintService
        .getSprintTasks(Number(this.paramId))
        .subscribe((response: sprintTaskResponse) => {
          this.sprintTasks = response.data;

          this.pendingTasks = this.sprintTasks.filter(
            (task) => task.status === TaskStatus.Pending
          );
          this.activeTasks = this.sprintTasks.filter(
            (task) => task.status === TaskStatus.Active
          );
          this.completedTasks = this.sprintTasks.filter(
            (task) => task.status === TaskStatus.Completed
          );
        })
    );
  }

  public drop(event: CdkDragDrop<sprintTasks[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];

      // Update the task's status based on the target container
      if (event.container.id === 'cdk-drop-list-0') {
        this.movedTo = 0;
      } else if (event.container.id === 'cdk-drop-list-1') {
        movedTask.status = TaskStatus.Active;
        this.movedTo = 1;
      } else if (event.container.id === 'cdk-drop-list-2') {
        movedTask.status = TaskStatus.Completed;
        this.movedTo = 2;
      }

      this.changeTaskStatus(this.movedTo, movedTask.id);
    }
  }

  private changeTaskStatus(movedTo: number, taskId: number): void {
    this.subscriptions.add(
      this.taskService.updateTaskStatus(movedTo, taskId).subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'info',
              summary: 'Updated',
              detail: 'Updated Status Successfully',
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Updating Task status',
          });
        },
      })
    );
  }

  public navigateToTaskView(taskId: number): void {
    this.router.navigate([`/task/view/${taskId}`]);
  }
}
