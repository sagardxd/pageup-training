import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { compileNgModule } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Custom-Header': 'Hello World'
    });

    return this.http.get(`${this.apiUrl}/posts`, { observe: 'response', headers })
  }

  getMovies(): any {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'movie-database-alternative.p.rapidapi.com',
      'x-rapidapi-key': 'adb75af8aemsh9f9f22c88e094acp1fd66fjsn697a231019f6'
    });

    return this.http.get(`https://movie-database-alternative.p.rapidapi.com/?s=Avengers%20Endgame&r=json&page=1`, { headers });
  }

  getWeather(): any {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com',
      'x-rapidapi-key': 'adb75af8aemsh9f9f22c88e094acp1fd66fjsn697a231019f6'
    });

    return this.http.get(`https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=35.5&lon=-78.5&units=imperial&lang=en`, { headers });

  }


  getEmploye(): Observable<any> {
    return this.http.get('https://192.168.197.179:8081/api/employee');

  }

  getComments(id: string): Observable<any> {
    const params = new HttpParams().set('postId', id);
    return this.http.get(`${this.apiUrl}/comments`, { params, responseType: 'text' });
  }
}



// conditional params

