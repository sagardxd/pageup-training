import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
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
import { TaskViewComponent } from './task-view/task-view.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SprintTasksComponent } from './sprint-tasks/sprint-tasks.component';

@NgModule({
  declarations: [TaskViewComponent, TaskEditComponent, SprintTasksComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
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
    DragDropModule,
    MatIconModule,
  ],
  exports: [],
})
export class TaskModule {}
