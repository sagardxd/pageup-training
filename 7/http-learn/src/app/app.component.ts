import { Component } from '@angular/core';
import { HttpService } from './services/http.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'http-learn';

  posts: any[] = [];
  statusCode: number = 0;
  headers: any;
  public comments = {};
  public employee = {};

  constructor(private hp: HttpService) { }

  ngOnInit(): void {
    this.getWeatherData();
  }

  getPosts() {
    this.hp.getPosts().subscribe((response: HttpResponse<any>) => {
      this.statusCode = response.status; // HTTP status code
      this.headers = response.headers; // HTTP headers
      this.posts = response.body; // Response body
      // console.log('Status Code:', this.statusCode);
      // console.log('Headers:', this.headers);
      // console.log('Body:', this.posts);
    });
  }

  getComments() {
    this.hp.getComments('1').subscribe((data) => {
      this.comments = data;
      console.log(data)
    })
  }

  getEmploye() {
    this.employee = this.hp.getEmploye().subscribe((data) => {
      console.log(data);
      this.employee = data;
    })
  }


  getMoviesData(): any {
    this.hp.getMovies().subscribe((data: any) => {
      console.log(data);
    })
  }

  getWeatherData(): any {
    this.hp.getWeather().subscribe((data: any) => {
      console.log(data);
    })
  }
}
