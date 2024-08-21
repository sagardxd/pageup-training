import { Component, OnInit } from '@angular/core';
import { subTasks, TaskById, TaskByIdResponse, TaskReview, TaskReviewResponse, TaskStatus, TaskType } from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit {

  public task: TaskById | null = null;
  private paramId: string | null = null;
  public taskReviews: TaskReview[] = [];
  public newReviewContent = '';
  public subTasks: subTasks[] = [];

  constructor(private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.paramId = params.get('id');
      if (this.paramId) {
        this.getTaskById();
      }
    });
  }

  private getTaskById(): void {
    if (this.paramId) {
      this.taskService.getTaskById(Number(this.paramId)).subscribe(
        (result: TaskByIdResponse) => {
          if (result.success) {
            this.task = result.data.task;
            this.taskReviews = result.data.reviews || [];
            this.subTasks = result.data.subTasks || [];
            this
          } else {
            console.error('Failed to fetch task:', result.message);
          }
        });
    }
  }

  // Method to get the status label from the enum
  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending: return 'Pending';
      case TaskStatus.Active: return 'In Progress';
      case TaskStatus.Completed: return 'Completed';
      default: return '';
    }
  }

  // Method to get the task type label from the enum
  getTaskTypeLabel(type: TaskType): string {
    switch (type) {
      case TaskType.Epic: return 'Epic';
      case TaskType.Feature: return 'Feature';
      case TaskType.Userstory: return 'User Story';
      case TaskType.Task: return 'Task';
      case TaskType.Bug: return 'Bug';
      default: return '';
    }
  }

  public addReview(): void {
    const body = {
      taskID: Number(this.paramId),
      content: this.newReviewContent
    }
    this.taskService.addReview(body).subscribe((result: TaskReviewResponse) => {
      if (result.success) {
        this.newReviewContent = '';
        this.getTaskById();
      } else {
        console.error('Failed to add review:', result.message);
      }
    });
  }


}