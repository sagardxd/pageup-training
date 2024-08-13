import { Component, OnInit } from '@angular/core';
import { TaskById, TaskByIdResponse, TaskReview, TaskReviewResponse } from '../../../models/task';
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

  constructor(private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getParamId();
    this.getTaskById();
  }

  private getParamId() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.paramId = params.get('id');
    });
  }

  private getTaskById(): void {
    if (this.paramId) {
      this.taskService.getTaskById(Number(this.paramId)).subscribe(
        (result: TaskByIdResponse) => {
          if (result.success) {
            this.task = result.data.task;
            this.taskReviews = result.data.reviews || [];
          } else {
            console.error('Failed to fetch task:', result.message);
          }
        });
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