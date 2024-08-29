import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/Auth/login/login.component';
import { EmployeeViewComponent } from './modules/employee/employee-view/employee-view.component';
import { RoleGuard } from './services/role.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'department',
    canActivate: [RoleGuard],
    loadChildren: () =>
      import('./modules/departments/departments.module').then(
        (m) => m.DepartmentsModule
      ),
  },
  {
    path: 'employee',
    canActivate: [RoleGuard],
    loadChildren: () =>
      import('./modules/employee/employee.module').then(
        (m) => m.EmployeeModule
      ),
  },
  {
    path: 'project',
    loadChildren: () =>
      import('./modules/project/project.module').then((m) => m.ProjectModule),
  },
  {
    path: 'task',
    loadChildren: () =>
      import('./modules/task/task.module').then((m) => m.TaskModule),
  },
  { path: 'profile', component: EmployeeViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
