import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo-service.service';
import { Todo } from '../../models/todo.model';
import { Gender } from '../../models/todo.model';

@Component({
  selector: 'app-todoitem',
  templateUrl: './todoitem.component.html',
  styleUrl: './todoitem.component.scss'
})
export class TodoitemComponent implements OnInit{

  paramId: string = '';
  todo: Todo | undefined;
  genderEnum = Gender;


  constructor(private activatedRoute: ActivatedRoute, private todoService: TodoService) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = paramMap.get('id')?? '';
      this.loadTodo();
    });
  }
  

  private loadTodo(): void {
    console.log('Loading todo with ID:', this.paramId); // 
    this.todo = this.todoService.getTodo(parseInt(this.paramId));
    console.log('Loaded todo:', this.todo); 
  }
}
