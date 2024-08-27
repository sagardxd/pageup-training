import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/Auth/login/login.component';
import { SprintTasksComponent } from './modules/task/sprint-tasks/sprint-tasks.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'department',
    loadChildren: () =>
      import('./modules/departments/departments.module').then(
        (m) => m.DepartmentsModule
      ),
  },
  {
    path: 'employee',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
