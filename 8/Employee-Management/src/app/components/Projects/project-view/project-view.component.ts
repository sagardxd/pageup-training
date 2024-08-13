import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { projectByIdData, projectByIdResponse, projectForm } from '../../../models/project';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../../Task/task-edit/task-edit.component';
import { TaskService } from '../../../services/task.service';
import { EmployeeListComponent } from '../../Employee/employee-list/employee-list.component';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent implements OnInit {

  private paramId = '';
  public project: projectByIdData | null = null;

  constructor(private activatedRoute: ActivatedRoute,
    private projectService: ProjectService, private dialog: MatDialog,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.getParamId();
  }

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id')) ?? '';
      if (this.paramId) {
        this.getProjectData();
      }
    });
  }

  private getProjectData(): void {
    this.projectService.getProjectById(Number(this.paramId)).subscribe((response: projectByIdResponse) => {
      if (response.success) {
        this.project = response.data;
      }
    });
  }

  public createTask(): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      'enterAnimationDuration': '0ms',
      'exitAnimationDuration': '0ms'
    });

    dialogRef.componentInstance.projectName = this.project?.name ?? '';
    dialogRef.componentInstance.assignedTo = this.project?.members;
    dialogRef.componentInstance.projectId = this.project?.id;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProjectData();
      }
    });
  }

  public deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(response => {
      if (response) {
        alert('Task Deleted Successfully');
        this.getProjectData();
      }
    });
  }

  public removeEmployee(id: number): void {
    this.project?.members?.splice(this.project.members.findIndex(member => member.employeeId === id), 1);
  }

  public addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeListComponent, {
      width: '1000px',
      height: '600px',
    });

    // dialogRef.componentInstance.projectEmployees = this.project?.members ?? [];
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.isAdding = true;

  }
}
