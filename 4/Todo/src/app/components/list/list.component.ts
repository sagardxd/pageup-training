import { Component } from '@angular/core';
import { TodoService } from '../../services/todo-service.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  
 constructor(private todoService : TodoService) {}

 public todoArray = this.todoService.getCompletedTodos();

}
