import { Injectable } from '@angular/core';
import { Gender, Todo } from '../models/todo.model';

@Injectable()
export class TodoService {
  public todos: Todo[] = [];
  public completedTodos: Todo[] = [];
  public index = 0;


  public addTodo(title: string, description: string, createdBy: string,createdAt: Date, gender: Gender): void {
    const newTodo: Todo = {
      id: this.index++,
      title: title,
      description: description,
      completed: false,
      editing: false,
      checked: false,
      createdBy: createdBy,
      createdAt: createdAt,
      completedAt: new Date,
      gender: gender,
    }
    this.todos.push(newTodo);
  }

  public markAsCompleted(id: number):void {
    this.todos[id].completed = true;
    this.todos[id].completedAt = new Date;
  } 

  public toggleChecked(id: number):void {
    this.todos[id].checked = !this.todos[id].checked;
  }

  public delete(id: number):void {
    console.log('here also')
    this.todos = this.todos.filter(todo => todo.id !== id);
    console.log(this.todos)
  }

  public deleteSelected():void {
    this.todos = this.todos.filter(todo => todo.checked == false);
  }

  public getCompletedTodos():Todo[] {
    this.completedTodos =  this.todos.filter(todo => todo.completed == true);
    return this.completedTodos;
  }

  public getTodo(id: number): Todo | undefined{
    return this.todos.find(todo => todo.id === id);
  }

  public getTodos(): Todo[] {
    return this.todos;
  }

}