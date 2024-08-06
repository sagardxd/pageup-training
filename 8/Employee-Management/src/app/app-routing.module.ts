import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './components/Department/department-list/department-list.component';
import { EmployeeListComponent } from './components/Employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from './components/Employee/employee-edit/employee-edit.component';
import { ProjectListComponent } from './components/Projects/project-list/project-list.component';
import { ProjectEditComponent } from './components/Projects/project-edit/project-edit.component';
import { ProjectViewComponent } from './components/Projects/project-view/project-view.component';

const routes: Routes = [
  { path: 'department', component: DepartmentListComponent },
  { path: 'employee', component: EmployeeListComponent },
  { path: 'employee/edit/:id', component: EmployeeEditComponent },
  { path: 'employee/add', component: EmployeeEditComponent },
  { path: 'project', component: ProjectListComponent },
  { path: 'project-add', component: ProjectEditComponent },
  { path: 'project-edit/:id', component: ProjectEditComponent },
  { path: 'project-view/:id', component: ProjectViewComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
