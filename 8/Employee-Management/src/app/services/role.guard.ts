import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: import('@angular/router').ActivatedRouteSnapshot,
    state: import('@angular/router').RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const role: number | null = Number(localStorage.getItem('role')) ?? null;

    if (role === 0) {
      // Navigate to login page if role is 0
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
