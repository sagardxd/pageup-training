import { Injectable } from '@angular/core';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public todos: Todo[] = [];

  add(todo: Todo): void {
    this.todos.push(todo);
  }

  delete(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  update(id: number, updatedTodo: Todo): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
    }
  }

  markAsComplete(id: number): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos[index].completed = true;
    }
  }

  getAll(): Todo[] {
    return this.todos;
  }
}
