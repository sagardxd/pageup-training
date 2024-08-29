import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { LoginResponse } from '../../../models/login';
import { AuthInterceptorService } from '../../../services/auth-interceptor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public username: string = '';
  public password: string = '';

  constructor(private router: Router, private loginService: LoginService) {}

  onSubmit(): void {
    if (this.username && this.password) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('isManager');
      localStorage.removeItem('id');
      this.loginService
        .login({ username: this.username, password: this.password })
        .subscribe((res: LoginResponse) => {
          if (res) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', String(res.data.employee.role));
            localStorage.setItem('id', String(res.data.employee.id));

            localStorage.setItem(
              'isManager',
              String(res.data.employee.isManager)
            );

            if (res.data.employee.role === 0) {
              this.router.navigate(['/project']);
            } else {
              this.router.navigate(['/department']);
            }
            this.username = '';
            this.password = '';
          } else {
            alert('Invalid username or password');
          }
        });
    } else {
      alert('Invalid username or password');
    }
  }
}
