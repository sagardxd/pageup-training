  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public getProducts() {
    return this.httpClient.get('http://localhost:3000/products');
  }

  public addProduct(data: any) { 
    return this.httpClient.post('http://localhost:3000/products', data);
  }

  public getProductById(id: string) {
    return this.httpClient.get(`http://localhost:3000/products/${id}`);
  }

  public updateProduct(id:string, data: any) {
    return this.httpClient.put(`http://localhost:3000/products/${id}`, data);
  }
}
