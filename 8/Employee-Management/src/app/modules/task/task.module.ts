import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { TaskRoutingModule } from './task-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TaskViewComponent } from './task-view/task-view.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { SprintTasksComponent } from './sprint-tasks/sprint-tasks.component';
import { TaskListComponent } from './task-list/task-list.component';
import { AddSprintComponent } from './add-sprint/add-sprint.component';

@NgModule({
  declarations: [
    TaskViewComponent,
    TaskEditComponent,
    SprintTasksComponent,
    TaskListComponent,
    AddSprintComponent,
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    DragDropModule,
    RouterModule,
    MatPaginatorModule,
    MatSortModule,
    ToastModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class TaskModule {}
