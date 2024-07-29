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

  public showRemovePopup = false;
  private productToRemove: string | null = null;
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
        this.calculateTotalAmount();
      });
    });


  }

  private calculateTotalAmount(): void {
    this.totalAmount = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      this.totalAmount += this.cartItems[i].product.sellingPrice * this.cartItems[i].quantity;
    }
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
    if (quantity > 1) {
      const data = {
        id: id,
        productId: productId,
        quantity: quantity - 1
      };
      this.cartService.quantityUpdate(id, data).subscribe(() => {
        this.getCartItems();
      });
    } else {
      this.showRemovePopup = true;
      this.productToRemove = id;
    }
  }

  public confirmRemoveProduct(): void {
    if (this.productToRemove != null) {
      this.removeItemFromCart(this.productToRemove);
      this.showRemovePopup = false;
      this.productToRemove = null;
    }
  }

  public cancelRemoveProduct(): void {
    this.showRemovePopup = false;
  }

  public removeItemFromCart(id: string): void {
    // console.log('i deleted it')
    this.cartService.deleteCartItem(id).subscribe(() => {
      this.getCartItems();
      this.cartService.notifyCartItemAdded();
      alert('Item removed from cart');
    });

  }

}
