import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { LoginResponse } from '../../../models/login';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm = new FormGroup({
    username: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  onSubmit(): void {
    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isManager');
    localStorage.removeItem('id');
    this.loginService
      .login({ username: username!, password: password! })
      .subscribe({
        next: (res: LoginResponse) => {
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', String(res.data.employee.role));
            localStorage.setItem('id', String(res.data.employee.id));
            localStorage.setItem(
              'isManager',
              String(res.data.employee.isManager)
            );

            if (res.data.employee.role === 0) {
              this.router.navigate(['/project']);
            } else if (res.data.employee.role === 1) {
              this.router.navigate(['/employee']);
            } else {
              this.router.navigate(['/dashboard']);
            }
            this.loginForm.reset();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Invalid username or password',
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error logging In',
          });
        },
      });
  }
}
