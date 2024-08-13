import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './components/Department/department-list/department-list.component';
import { EmployeeListComponent } from './components/Employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from './components/Employee/employee-edit/employee-edit.component';
import { ProjectListComponent } from './components/Projects/project-list/project-list.component';
import { ProjectEditComponent } from './components/Projects/project-edit/project-edit.component';
import { ProjectViewComponent } from './components/Projects/project-view/project-view.component';
import { EmployeeViewComponent } from './components/Employee/employee-view/employee-view.component';
import { TaskListComponent } from './components/Task/task-list/task-list.component';
import { TaskEditComponent } from './components/Task/task-edit/task-edit.component';
import { TaskViewComponent } from './components/Task/task-view/task-view.component';
import { LoginComponent } from './components/Auth/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'department', component: DepartmentListComponent },
  { path: 'employee', component: EmployeeListComponent },
  { path: 'employee/edit/:id', component: EmployeeEditComponent },
  { path: 'employee/add', component: EmployeeEditComponent },
  { path: 'employee/view/:id', component: EmployeeViewComponent },
  { path: 'project', component: ProjectListComponent },
  { path: 'project-add', component: ProjectEditComponent },
  { path: 'project-edit/:id', component: ProjectEditComponent },
  { path: 'project-view/:id', component: ProjectViewComponent },
  { path: 'task', component: TaskListComponent },
  { path: 'task-edit/:id', component: TaskEditComponent },
  { path: 'task/view/:id', component: TaskViewComponent },
  { path: 'task/add', component: TaskEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
