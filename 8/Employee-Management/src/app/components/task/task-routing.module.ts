import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { SprintTasksComponent } from './sprint-tasks/sprint-tasks.component';
import { formDeactivateGuard } from '../../services/pending-changes.guard';

const routes: Routes = [
  {
    path: 'add',
    component: TaskEditComponent,
  },
  {
    path: 'edit/:id',
    component: TaskEditComponent,
    canDeactivate: [formDeactivateGuard],
  },
  {
    path: 'view/:id',
    component: TaskViewComponent,
    canDeactivate: [formDeactivateGuard],
  },
  { path: 'sprint/:id', component: SprintTasksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
