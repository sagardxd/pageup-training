import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodolistComponent } from './components/todolist/todolist.component';
import { ListComponent } from './components/list/list.component';
import { HomeTodoComponent } from './components/home-todo/home-todo.component';
import { TodoitemComponent } from './components/todoitem/todoitem.component';
import { EnumtonamePipe } from './pipes/enumtoname.pipe';
import { GendertodesignationPipe } from './pipes/gendertodesignation.pipe';
import { TodoService } from './services/todo-service.service';
import { HighlightDirective } from './custom-directive/highlight.directive';


@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    ListComponent,
    HomeTodoComponent,
    TodoitemComponent,
    EnumtonamePipe,
    GendertodesignationPipe,
    HighlightDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [TodoService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
