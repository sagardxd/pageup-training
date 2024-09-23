import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { taskpaginationData, TaskType } from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { projectByIdData, projectByIdResponse } from '../../../models/project';
import { ProjectService } from '../../../services/project.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

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
export class TaskTreeComponent implements OnDestroy {
  @Input() items!: WorkItem[];
  @Input() projectId!: string;
  @Input() pageIndex!: number;
  @Input() pageItemsCount!: number;

  @Output() taskUpdated = new EventEmitter<void>();

  public expanded: boolean = false;
  public childrenLoaded = false;
  public project: projectByIdData | null = null;
  public paramId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.getParamId();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public loadChildren(item: WorkItem) {
    this.subscriptions.add(
      this.taskService.getChildren(item.id).subscribe({
        next: (children) => {
          item.children = children.data;
          item.childrenLoaded = true;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading children',
          });
        },
      })
    );
  }

  private getParamId(): void {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe((params) => {
        this.paramId = params['id'];
      })
    );
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

  public addTask(id: number, taskType: TaskType, name: string) {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.projectName = name;
    dialogRef.componentInstance.projectId = Number(this.projectId);
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.isAdding = true;

    this.subscriptions.add(
      this.projectService.getProjectById(Number(this.paramId)).subscribe({
        next: (response: projectByIdResponse) => {
          if (response.success) {
            this.project = response.data;
            dialogRef.componentInstance.project = this.project;
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Fetching Project Details',
          });
        },
      })
    );

    dialogRef.componentInstance.taskForm.patchValue({
      taskType: taskType + 1,
      parentId: id,
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.taskUpdated.emit();
        }
      })
    );
  }

  public editTask(id: number): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.projectId = Number(this.projectId);
    dialogRef.componentInstance.taskId = id;
    dialogRef.componentInstance.getTaskDetails(id);

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.taskUpdated.emit();
        }
      })
    );
  }

  public viewTask(id: number) {
    this.router.navigate([`/task/view/${id}`]);
  }
}
