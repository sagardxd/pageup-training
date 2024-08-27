import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DialogComponent } from './dialog/dialog.component';
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
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DepartmentListComponent, DialogComponent],
  imports: [
    CommonModule,
    DepartmentsRoutingModule,
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
    SharedModule,
  ],
})
export class DepartmentsModule {}
