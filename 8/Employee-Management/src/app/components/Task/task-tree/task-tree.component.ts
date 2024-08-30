import { Component, EventEmitter, Input, Output } from '@angular/core';
import { taskpaginationData, TaskType } from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { projectByIdData, projectByIdResponse } from '../../../models/project';
import { ProjectService } from '../../../services/project.service';

export interface WorkItem extends taskpaginationData {
  parentId?: number;
  children?: WorkItem[];
  childrenLoaded?: boolean;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrl: './task-tree.component.scss',
})
export class TaskTreeComponent {
  @Input() items!: WorkItem[];
  @Input() projectId!: string;
  @Input() pageIndex!: number;
  @Input() pageItemsCount!: number;

  @Output() taskUpdated = new EventEmitter<void>();

  public expanded: boolean = false;
  public childrenLoaded = false;
  public project: projectByIdData | null = null;
  public paramId: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute
  ) {
    this.getParamId();
  }

  public loadChildren(item: WorkItem) {
    this.taskService.getChildren(item.id).subscribe((children) => {
      item.children = children.data;
      item.childrenLoaded = true;
    });
  }

  private getParamId(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.paramId = params['id'];
    });
  }

  public toggle(item: WorkItem) {
    item.isExpanded = !item.isExpanded; // Use isExpanded to toggle the state
    if (item.isExpanded && !item.childrenLoaded) {
      this.loadChildren(item);
    }
  }

  public hasChildren(item: WorkItem): boolean {
    return item.children ? item.children.length > 0 : false;
  }

  public getTaskTypeLabel(type: TaskType): string {
    switch (type) {
      case TaskType.Epic:
        return 'Epic';
      case TaskType.Userstory:
        return 'UserStory';
      case TaskType.Feature:
        return 'Feature';
      case TaskType.Task:
        return 'Task';
      case TaskType.Bug:
        return 'Bug';
      default:
        return '';
    }
  }

  public getTypeClass(type: TaskType): string {
    switch (type) {
      case TaskType.Epic:
        return 'Epic';
      case TaskType.Feature:
        return 'Feature';
      case TaskType.Userstory:
        return 'UserStory';
      case TaskType.Task:
        return 'Task';
      case TaskType.Bug:
        return 'Bug';
      default:
        return '';
    }
  }

  public addTask(id: number, taskType: TaskType, name: string) {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.projectName = name;
    dialogRef.componentInstance.projectId = Number(this.projectId);
    dialogRef.componentInstance.isTaskEdit = true;
    console.log(dialogRef.componentInstance.paramId);

    this.projectService
      .getProjectById(Number(this.paramId))
      .subscribe((response: projectByIdResponse) => {
        if (response.success) {
          this.project = response.data;
          dialogRef.componentInstance.project = this.project;
        }
      });

    dialogRef.componentInstance.taskForm.patchValue({
      taskType: taskType + 1,
      parentId: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskUpdated.emit();
      }
    });
  }

  public viewTask(id: number) {
    this.router.navigate([`/task/view/${id}`]);
  }
}
