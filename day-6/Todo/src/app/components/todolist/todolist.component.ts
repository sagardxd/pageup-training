import { ChangeDetectorRef, Component } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo-service.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.scss'
})
export class TodolistComponent {
  public todoArray: Todo[] = [];
  
  constructor(private todoService: TodoService,private cdr: ChangeDetectorRef) {
    this.updateTodos();
  }

  public toggleChecked(id: number): void {
    this.todoService.toggleChecked(id);
  }

 public  markAsComplete(id:number): void {
    this.todoService.markAsCompleted(id);
  }

  public selectAll(): void {
    this.todoService.todos.forEach(todo => todo.checked = true );
  }

  private updateTodos() {
    this.todoArray = this.todoService.getTodos();
  }

  public deleteCurr() {
    this.todoService.deleteSelected();
    this.updateTodos();
  }

  public deleteitem(id: number): void {
    console.log("here")
    this.todoService.delete(id);
    this.updateTodos();
  }
} 
