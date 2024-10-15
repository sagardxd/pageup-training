import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDashboardComponent } from './components/order-dashboard/order-dashboard.component';
import { OrderComponent } from './components/order/order.component';
import { OrderViewComponent } from './components/order-view/order-view.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  {
    path: 'dashboard',
    component: OrderDashboardComponent,
  },
  {
    path: 'order-view/:id',
    component: OrderViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
