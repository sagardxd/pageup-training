import { Component, OnInit } from '@angular/core';
import { paginatedProjectData, project } from '../../../models/project';
import { ProjectService } from '../../../services/project.service';
import { paginatedBody } from '../../../models/department';
import { PageEvent } from '@angular/material/paginator';
import { paginatedEmployeeData } from '../../../models/emloyee';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  public projects: project[] = [];
  public paginationData: paginatedBody = {
    pageIndex: 1,
    pagedItemsCount: 10,
    orderKey: '',
    sortedOrder: 0,
    search: '',
    dateRange: null,
  };

  public totalPages = 0;
  public totalItems = 0;
  private paramId = '';
  public isEdit = false;
  public range: FormGroup;
  public role: number | null = null;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private deletedialogService: DeletedialogService,
    private messageService: MessageService
  ) {
    this.range = new FormGroup({
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getPaginatedProjectData();
    this.getParamId();
    this.getRole();
    // Subscribe to value changes on the form group
    this.range.valueChanges.subscribe((value) => {
      this.updateDateRange(value);
    });
  }

  private getRole(): void {
    this.role = Number(localStorage.getItem('role')) || null;
  }

  private updateDateRange(value: any) {
    if (value.start && value.end) {
      const { start, end } = value;
      this.paginationData.dateRange = {
        startDate: start,
        endDate: end,
      };

      console.log(this.paginationData.dateRange);

      if (this.paginationData.dateRange.endDate != null) {
        this.getPaginatedProjectData();
      }
    }
  }

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.paramId = paramMap.get('id') ?? '';
      if (this.paramId) {
        this.isEdit = true;
        this.getProjectData();
      }
    });
  }

  private getPaginatedProjectData() {
    this.projectService
      .getPaginatedProjects(this.paginationData)
      .subscribe((response: paginatedProjectData) => {
        this.projects = response.data.data;
        this.totalPages = response.data.totalPages;
        this.totalItems = response.data.totalItems;
      });
  }

  private getProjectData(): void {
    this.projectService
      .getProjectById(Number(this.paramId))
      .subscribe((response) => {});
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
    } else if (event.direction === 'desc') {
      this.paginationData.sortedOrder = 0;
    } else {
      this.paginationData.sortedOrder = 2;
    }
    this.getPaginatedProjectData();
  }

  public handleDelete(id: number): void {
    this.deletedialogService
      .openDialog()
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.projectService.deleteProject(id).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Department Deleted Successfully',
            });
            this.getPaginatedProjectData();
          });
        }
      });
  }
}
