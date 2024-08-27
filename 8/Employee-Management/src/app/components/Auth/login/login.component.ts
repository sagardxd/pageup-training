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

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authInterceptorService: AuthInterceptorService
  ) {}

  onSubmit(): void {
    if (this.username && this.password) {
      this.loginService
        .login({ username: this.username, password: this.password })
        .subscribe((res: LoginResponse) => {
          if (res) {
            localStorage.setItem('token', res.data.token);
            this.router.navigate(['/department']);
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
