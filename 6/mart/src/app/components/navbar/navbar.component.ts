import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CartItem } from '../../models/cart';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  public cartItemCount = 0;
  public cartItems : CartItem[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.getCartItems();
    
    this.cartService.cartItemAdded$.subscribe(() => {
      this.getCartItems();
    });
  }

  private getCartItems():void {
    this.cartService.getCartItems().subscribe((data ) => {
      this.cartItems = data;
      this.getLength();    
    });

  }

  private getLength(): void {
    this.cartItemCount = this.cartItems ? this.cartItems.length : 0;
  }


}
