import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Gender } from '../../models/todo.model';
import { TodoService } from '../../services/todo-service.service';

@Component({
  selector: 'app-home-todo',
  templateUrl: './home-todo.component.html',
  styleUrl: './home-todo.component.scss'
})
export class HomeTodoComponent {
  public gender = Gender;

  constructor(private todoService: TodoService) {}

  public todoForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    createdBy: new FormControl(''),
    createdAt: new FormControl(new Date()),
    gender: new FormControl(Gender.male),
  })

  public todoSubmit() {
    if (this.todoForm.value.title?.length != 0 && this.todoForm.value.description?.length != 0
       && this.todoForm.value.createdBy?.length != 0) {

      this.todoService.addTodo(
        this.todoForm.value.title as string,
        this.todoForm.value.description as string,
        this.todoForm.value.createdBy as string,
        this.todoForm.value.createdAt as Date,
        this.todoForm.value.gender as Gender)
    }
  }
}