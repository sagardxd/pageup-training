import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    SharedModule,
    ChartModule,
  ],
})
export class AdminModule {}
