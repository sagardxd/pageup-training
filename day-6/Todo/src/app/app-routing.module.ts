import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { HomeTodoComponent } from './components/home-todo/home-todo.component';
import { TodoitemComponent } from './components/todoitem/todoitem.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeTodoComponent },
  {
    path: 'list', component: ListComponent,
    children: [
      { path: 'details/:id', component: TodoitemComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
