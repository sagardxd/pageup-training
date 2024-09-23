import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeCount } from '../../../models/emloyee';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../../../services/project.service';
import { ProjectCount, ProjectCountResponse } from '../../../models/project';
import { DepartmentService } from '../../../services/department.service';
import {
  DepartmentCount,
  DepartmentCountResponse,
} from '../../../models/department';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  public employeeCount: EmployeeCount | null = null;
  private projectCount: ProjectCount | null = null;
  private departmentCount: DepartmentCount[] | null = null;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private departmentService: DepartmentService
  ) {}

  data: any;
  options: any;
  basicData: any;
  basicOptions: any;

  ngOnInit() {
    this.getCount();

    // getting the project details for the pie chart
    this.projectService
      .getProjectCount()
      .subscribe((res: ProjectCountResponse) => {
        this.projectCount = res.data;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.data = {
          labels: ['Pending', 'Active', 'Completed'],
          datasets: [
            {
              data: [
                this.projectCount.pending,
                this.projectCount.active,
                this.projectCount.completed,
              ],
              backgroundColor: [
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--green-500'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--yellow-400'),
                documentStyle.getPropertyValue('--green-400'),
              ],
            },
          ],
        };

        this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor,
              },
            },
          },
        };
      });

    // getting the departments details for the pie chart
    this.departmentService
      .getDepartmentCount()
      .subscribe((res: DepartmentCountResponse) => {
        this.departmentCount = res.data;
        let departmentName: string[] = [];
        let departmentCounts: number[] = [];

        for (let i = 0; i < this.departmentCount.length; i++) {
          departmentName.push(this.departmentCount[i].name);
          departmentCounts.push(this.departmentCount[i].count);
        }

        // graph logic
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
          '--text-color-secondary'
        );
        const surfaceBorder =
          documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
          labels: departmentName,
          datasets: [
            {
              label: 'Department Employees',
              data: departmentCounts,
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
              ],
              borderWidth: 1,
            },
          ],
        };

        this.basicOptions = {
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
            x: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };
      });
  }

  private getCount(): void {
    this.employeeService.employeeCount().subscribe({
      next: (response: EmployeeCount) => {
        this.employeeCount = response;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error getting Employee List Count',
        });
      },
    });
  }
}
