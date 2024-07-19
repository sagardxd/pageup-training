import { Component } from '@angular/core';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTodoTitle: string = '';
  public todos: Todo[] = [];

  addTodo() {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: this.newTodoTitle,
      completed: false
    };

    this.todos.push(newTodo);
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
