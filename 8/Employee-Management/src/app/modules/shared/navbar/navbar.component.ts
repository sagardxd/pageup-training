import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  public role: number | null = null;
  public isManager: boolean = false;

  ngOnInit(): void {
    this.getRole();
  }

  private getRole(): void {
    this.role = Number(localStorage.getItem('role')) || null;
    this.isManager = Boolean(localStorage.getItem('isManger')) || false;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isManager');
    localStorage.removeItem('id');
  }
}
