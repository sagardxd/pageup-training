import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

   public getCategories(){
    return this.httpClient.get('http://localhost:3000/category');
   } 

   public addCategory(createBody: any) {
    return this.httpClient.post('http://localhost:3000/category', createBody)
   }

   public getCategoryById(id: string) {
    return this.httpClient.get(`http://localhost:3000/category/${id}`);
   }

   public updateCategory(id: string, updateBody: any) {
    return this.httpClient.put(`http://localhost:3000/category/${id}`, updateBody);
   }

}
