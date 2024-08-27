import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-sprint-tasks',
  templateUrl: './sprint-tasks.component.html',
  styleUrl: './sprint-tasks.component.scss',
})
export class SprintTasksComponent implements OnInit {
  private paramId = '';
  public sprintTasks: sprintTasks[] | null = null;
  public pendingTasks: sprintTasks[] = [];
  public activeTasks: sprintTasks[] = [];
  public completedTasks: sprintTasks[] = [];
  private movedTo = 0;

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

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.paramId = paramMap.get('id') ?? '';
      if (this.paramId) {
        this.getSprintTasks();
      }
    });
  }

  private getSprintTasks(): void {
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
      });
  }

  public drop(event: CdkDragDrop<sprintTasks[]>) {
    console.log(event);
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

      console.log(this.pendingTasks);
      const movedTask = event.container.data[event.currentIndex];

      // Update the task's status based on the target container
      if (event.container.id === 'cdk-drop-list-0') {
        this.movedTo = 0;
        console.log(this.pendingTasks);
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
    this.taskService.updateTaskStatus(movedTo, taskId).subscribe((response) => {
      if (response) {
        this.messageService.add({
          severity: 'info',
          summary: 'Updated',
          detail: 'Updated Status Successfully',
        });
      }
    });
  }

  public navigateToTaskView(taskId: number): void {
    console.log('jey');
    this.router.navigate([`/task/view/${taskId}`]);
  }
}
