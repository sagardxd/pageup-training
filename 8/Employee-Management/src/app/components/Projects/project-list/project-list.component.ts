import { Component, OnInit } from '@angular/core';
import { paginatedProjectData, project } from '../../../models/project';
import { ProjectService } from '../../../services/project.service';
import { paginatedBody } from '../../../models/department';
import { PageEvent } from '@angular/material/paginator';
import { paginatedEmployeeData } from '../../../models/emloyee';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeesComponent } from '../add-employees/add-employees.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {

  public projects: project[] = [];
  public paginationData: paginatedBody = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: "",
    sortedOrder: 2,
    search: ""
  }

  public totalPages = 0;
  public totalItems = 0;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getPaginatedProjectData();
  }

  private getPaginatedProjectData() {
    this.projectService.getPaginatedProjects(this.paginationData).subscribe((response: paginatedProjectData) => {
      this.projects = response.data.data;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    });
  }

  public onPageEvent(event: PageEvent): void {
    this.paginationData.pageIndex = event.pageIndex + 1;
    this.paginationData.pagedItemsCount = event.pageSize;
    this.getPaginatedProjectData();
  }


  public handleSearch(): void {
    this.getPaginatedProjectData();
  }

  public sortData(event: any): void {
    console.log(event.active);
    console.log(event.direction);
    this.paginationData.orderKey = event.active;

    if (event.direction === 'asc') {
      this.paginationData.sortedOrder = 1;
    }
    else if (event.direction === 'desc') {
      this.paginationData.sortedOrder = 0;
    }
    else {
      this.paginationData.sortedOrder = 2;
    }
    this.getPaginatedProjectData();
  }

}
