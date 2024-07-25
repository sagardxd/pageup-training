import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem, CartItemWithProduct } from '../../../models/cart';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit{

  public cartItems : CartItemWithProduct[] = [];
  public cartData : CartItem[] = [];


  constructor(private cartService: CartService,
    private productService : ProductService
  ) {}

  ngOnInit(): void {
    this.getCartItems();
  }
  
  public getCartItems(): void {
    this.cartService.getCartItems().subscribe((data) => {
      this.cartData = data;
      this.getProductItems();
    });
  }

      // getting product Items to map them with cart items
      public getProductItems() :void {
        this.cartData.forEach((cartItem) => {
          this.productService.getProductById(cartItem.productId).subscribe((product) => {
            this.cartItems.push({
              ...cartItem,
              product
            });
          });
        });
      }
  
}
