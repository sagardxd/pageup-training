import { Component, OnDestroy, OnInit } from '@angular/core';
import { paginatedProjectData, project } from '../../../models/project';
import { ProjectService } from '../../../services/project.service';
import { paginatedBody } from '../../../models/department';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DeletedialogService } from '../../../services/deletedialog.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit, OnDestroy {
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
  private subscriptions: Subscription = new Subscription();
  public isAdmin = false;

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
    const role = Number(localStorage.getItem('role')) || null;
    if (role && role === 1) {
      this.isAdmin = true;
    }

    this.getParamId();
    this.getPaginatedProjectData();
    this.getRole();
    // Subscribe to value changes on the form group
    this.subscriptions.add(
      this.range.valueChanges.subscribe((value) => {
        this.updateDateRange(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

      if (this.paginationData.dateRange.endDate != null) {
        this.getPaginatedProjectData();
      }
    }
  }

  private getParamId(): void {
    this.subscriptions.add(
      this.activatedRoute.paramMap.subscribe({
        next: (paramMap) => {
          this.paramId = paramMap.get('id') ?? '';
          if (this.paramId) {
            this.isEdit = true;
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error getting ParamId',
          });
        },
      })
    );
  }

  private getPaginatedProjectData() {
    this.subscriptions.add(
      this.projectService.getPaginatedProjects(this.paginationData).subscribe({
        next: (response: paginatedProjectData) => {
          this.projects = response.data.data;
          this.totalPages = response.data.totalPages;
          this.totalItems = response.data.totalItems;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching Projects',
          });
        },
      })
    );
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
    this.subscriptions.add(
      this.deletedialogService
        .openDialog()
        .afterClosed()
        .subscribe({
          next: (result) => {
            if (result) {
              this.deleteProject(id);
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Deleting Project',
            });
          },
        })
    );
  }

  public deleteProject(id: number): void {
    this.subscriptions.add(
      this.projectService.deleteProject(id).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Project Deleted Successfully',
        });
        this.getPaginatedProjectData();
      })
    );
  }

  public resetDate(): void {
    this.paginationData.dateRange = null;
    this.range.reset();
    this.getPaginatedProjectData();
  }
}
