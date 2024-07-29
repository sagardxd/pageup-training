import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('http://localhost:3000/products');
  }

  public addProduct(data: any) {
    return this.httpClient.post('http://localhost:3000/products', data);
  }

  public getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`http://localhost:3000/products/${id}`);
  }

  public updateProduct(id: string, data: any) {
    return this.httpClient.put(`http://localhost:3000/products/${id}`, data);
  }

  public deleteProduct(id: string) {
    return this.httpClient.delete(`http://localhost:3000/products/${id}`);
  }

  public searchProduct(searchParam: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`http://localhost:3000/products?productname=${searchParam}`);
  }
}
