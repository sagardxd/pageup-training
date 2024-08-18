import { Component, Input } from '@angular/core';
import { taskpaginationData, TaskType } from '../../../models/task';
import { TaskService } from '../../../services/task.service';


export interface WorkItem extends taskpaginationData {
  parentId?: number; // Optional: ID of the parent task, if any
  children?: WorkItem[]; // Array of child work items (initially undefined or empty)
  childrenLoaded?: boolean; // Indicates if children are loaded
  isExpanded?: boolean;
}

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrl: './task-tree.component.scss'
})
export class TaskTreeComponent {
  @Input() items!: WorkItem[];

  public expanded: boolean = false;
  public childrenLoaded = false;

  constructor(private taskService: TaskService) { }

  loadChildren(item: WorkItem) {
    this.taskService.getChildren(item.id).subscribe(children => {
      item.children = children.data;
      item.childrenLoaded = true;
    });
  }

  toggle(item: WorkItem) {
    item.isExpanded = !item.isExpanded; // Use isExpanded to toggle the state
    if (item.isExpanded && !item.childrenLoaded) {
      this.loadChildren(item);
    }
  }

  hasChildren(item: WorkItem): boolean {
    return item.children ? item.children.length > 0 : false;
  }

  getTaskTypeLabel(type: TaskType): string {
    switch (type) {
      case TaskType.Epic: return 'Epic';
      case TaskType.Userstory: return 'UserStory';
      case TaskType.Feature: return 'Feature';
      case TaskType.Task: return 'Task';
      case TaskType.Bug: return 'Bug';
      default: return '';
    }
  }

  getTypeClass(type: TaskType): string {
    switch (type) {
      case TaskType.Epic: return 'Epic';
      case TaskType.Feature: return 'Feature';
      case TaskType.Userstory: return 'UserStory';
      case TaskType.Task: return 'Task';
      case TaskType.Bug: return 'Bug';
      default: return '';
    }
  }

}
