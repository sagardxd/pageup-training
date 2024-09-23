import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { TaskTreeComponent } from '../task/task-tree/task-tree.component';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectEditComponent,
    ProjectViewComponent,
    TaskTreeComponent,
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    SharedModule,
    MatIconModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    MatPaginatorModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterModule,
    MatSortModule,
  ],
})
export class ProjectModule {}
