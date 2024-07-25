import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem, CartItemWithProduct } from '../../../models/cart';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {

  public cartItems: CartItemWithProduct[] = [];
  public cartData: CartItem[] = [];
  public callProductId = false;
  public totalAmount = 0;


  constructor(private cartService: CartService,
    private productService: ProductService
  ) { }

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
  public getProductItems(): void {
    this.cartItems = [];
    this.cartData.forEach((cartItem) => {
      this.productService.getProductById(cartItem.productId).subscribe((product) => {
        this.cartItems.push({
          ...cartItem,
          product
        });
      });
    });

  }

  public increaseQuantity(id: string, productId: string, quantity: number): void {
    const data = {
      id: id,
      productId: productId,
      quantity: quantity + 1
    };
    this.cartService.quantityUpdate(id, data).subscribe(() => {
      this.getCartItems();
    });
  }

  public decreaseQuantity(id: string, productId: string, quantity: number): void {
    if (quantity > 0) {
      const data = {
        id: id,
        productId: productId,
        quantity: quantity - 1
      };
      this.cartService.quantityUpdate(id, data).subscribe(() => {
        this.getCartItems();
      });
    }
  }

  public removeItemFromCart(id: string): void {
    this.cartService.deleteCartItem(id).subscribe(() => {
      this.getCartItems();
      this.cartService.notifyCartItemAdded();
    });

  }

}
