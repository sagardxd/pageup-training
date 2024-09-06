import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'edit/:id', component: EmployeeEditComponent },
  { path: 'add', component: EmployeeEditComponent },
  { path: 'view/:id', component: EmployeeViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
