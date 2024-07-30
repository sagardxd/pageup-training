import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CartItem } from '../../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemAddedSubject = new Subject<void>();
  cartItemAdded$ = this.cartItemAddedSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  // Method to notify to update the cart item count
  public notifyCartItemAdded(): void {
    this.cartItemAddedSubject.next();
  }

  public getCartItems(): Observable<CartItem[]> {
    return this.httpClient.get<CartItem[]>('http://localhost:3000/cart');
  }

  public addCartItem(createBody: { productId: string, quantity: number }): Observable<CartItem> {
    return this.httpClient.post<CartItem>('http://localhost:3000/cart', createBody);
  }

  public quantityUpdate(id: string, createdBody: { quantity: number }): Observable<CartItem> {
    return this.httpClient.put<CartItem>(`http://localhost:3000/cart/${id}`, createdBody);
  }

  public deleteCartItem(id: string): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/cart/${id}`);
  }

  public getCartItemById(id: string): Observable<CartItem> {
    return this.httpClient.get<CartItem>(`http://localhost:3000/cart/${id}`);
  }

}
