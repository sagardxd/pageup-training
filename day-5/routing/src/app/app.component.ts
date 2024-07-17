import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'routing';
  currentItem = '';

  obj : object = {
    a: 1,
    b: 2,
    c: 3
  }


  items = ['item1', 'item2', 'item3'];

  addItem(newItem: string) {
    this.items.push(newItem);
  }

  loginForm = new FormGroup({
    name: new FormControl('',[ Validators.required, Validators.pattern('^[a-zA-Z ]+$')] ),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  loginUser() { 
    console.log(this.loginForm.value);
  }

  get name() {
    return this.loginForm.get('name');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
