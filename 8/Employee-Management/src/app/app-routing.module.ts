import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './components/Department/department-list/department-list.component';
import { EmployeeListComponent } from './components/Employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from './components/Employee/employee-edit/employee-edit.component';

const routes: Routes = [
  { path: 'department', component: DepartmentListComponent },
  { path: 'employee', component: EmployeeListComponent },
  { path: 'employee/edit/:id', component: EmployeeEditComponent },
  { path: 'employee/add', component: EmployeeEditComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
