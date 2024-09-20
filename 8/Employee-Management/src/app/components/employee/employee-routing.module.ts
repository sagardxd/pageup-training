import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { formDeactivateGuard } from '../../services/pending-changes.guard';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  {
    path: 'edit/:id',
    component: EmployeeEditComponent,
    canDeactivate: [formDeactivateGuard],
  },
  { path: 'add', component: EmployeeEditComponent },
  { path: 'view/:id', component: EmployeeViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
