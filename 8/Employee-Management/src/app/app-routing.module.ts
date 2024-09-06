import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeViewComponent } from './components/employee/employee-view/employee-view.component';
import { RoleGuard } from './services/role.guard';
import { authGuard } from './services/auth.guard';
import { LayoutComponent } from './components/Layout/layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard, RoleGuard],
        loadChildren: () =>
          import('./components/admin/admin.module').then((m) => m.AdminModule),
      },

      {
        path: 'department',
        canActivate: [RoleGuard, authGuard],
        loadChildren: () =>
          import('./components/departments/departments.module').then(
            (m) => m.DepartmentsModule
          ),
      },
      {
        path: 'employee',
        canActivate: [RoleGuard, authGuard],
        loadChildren: () =>
          import('./components/employee/employee.module').then(
            (m) => m.EmployeeModule
          ),
      },
      {
        path: 'project',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./components/project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: 'task',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./components/task/task.module').then((m) => m.TaskModule),
      },
      { path: 'profile', component: EmployeeViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
