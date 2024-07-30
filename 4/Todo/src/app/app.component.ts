import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Gender } from './models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title = 'Todo';

}