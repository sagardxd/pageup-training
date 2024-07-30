import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

   public getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('http://localhost:3000/category');
   } 

   public addCategory(createBody: any) {
    return this.httpClient.post('http://localhost:3000/category', createBody)
   }

   public getCategoryById(id: string): Observable<Category> {
    return this.httpClient.get<Category>(`http://localhost:3000/category/${id}`);
   }

   public updateCategory(id: string, updateBody: any) {
    return this.httpClient.put(`http://localhost:3000/category/${id}`, updateBody);
   }

   public deleteCategory(id: string) {
    return this.httpClient.delete(`http://localhost:3000/category/${id}`);
   }

   public searchCategory(searchParam: string): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`http://localhost:3000/category?name=${searchParam}`);
   }

}
