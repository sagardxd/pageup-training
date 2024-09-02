import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Employee, EmployeeById } from '../../../models/emloyee';
import { ProjectService } from '../../../services/project.service';
import { EmployeesProject, project } from '../../../models/project';
import { MatDialog } from '@angular/material/dialog';
import { TaskListComponent } from '../../task/task-list/task-list.component';
import { TaskService } from '../../../services/task.service';
import { TaskPaginationBodyTask } from '../../../models/task';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss',
})
export class EmployeeViewComponent implements OnInit {
  private paramId = '';
  private id: number | null = null;
  public employee: Employee | null = null;
  public projects: project[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.id = Number(localStorage.getItem('id')) || null;
    if (this.id == null) {
      this.getParamId();
    } else {
      this.getEmployeeData(this.id);
    }
  }

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.paramId = paramMap.get('id') ?? '';
        if (this.paramId) {
          this.getEmployeeData(Number(this.paramId));
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Deparments',
        });
      },
    });
  }

  private getEmployeeData(id: number) {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (response: EmployeeById) => {
        if (response.success) {
          this.employee = response.data;
          console.log(response.data);
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch Employees',
        });
      },
    });
  }

  getEmployeeProjects(id: number | undefined): void {
    if (id) {
      this.projectService.getProjectOfEmployee(id).subscribe({
        next: (response: EmployeesProject) => {
          this.projects = response.data;
          console.log(this.projects);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch project',
          });
        },
      });
    }
  }

  public getProjectTasks(id: number): void {
    const dialogRef = this.dialog.open(TaskListComponent, {
      width: '1000px',
      height: '600px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
    });

    dialogRef.componentInstance;
    dialogRef.componentInstance.dialogref = dialogRef;
    dialogRef.componentInstance.projectId = id;
    if (this.id != null) {
      dialogRef.componentInstance.paginationData.assignedTo = [this.id];
    }
  }
}
