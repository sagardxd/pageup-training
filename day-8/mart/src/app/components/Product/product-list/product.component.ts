import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem } from '../../../models/cart';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  public productList: Product[] = [];
  private cartItemIdToUpdate: string | null = null;
  private cartItemIdToUpdateQuantity: number | null = null;
  private cartItems: CartItem[] = [];
  public quantities: { [key: string]: number } = {};
  public searchParam = '';
  private productToDelete: string | null = null;
  public showDeletePopup = false;
  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCartItems();
  }

  changeInSearch(event: { target: { value: string; } }): void {
    this.searchParam = event.target.value;
  }

  public getProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.productList = data;
    });
  }

  public deleteProduct(id: string): void {
    this.showDeletePopup = true;
    this.productToDelete = id;
  }


  public onChange(event: Event): void {
    this.searchParam = (event.target as HTMLInputElement).value;
    this.searchProduct();
  }

  public searchProduct(): void {
    if (this.searchParam == '') {
      this.getProducts();
    } else {
      this.productService.searchProduct(this.searchParam).subscribe(data => {
        this.productList = data;
      });
    }
  }

  public confirmDelete(): void {
    if (this.productToDelete != null) {
      this.productService.deleteProduct(this.productToDelete).subscribe(() => {
        this.showDeletePopup = false;
        this.productToDelete = null;
        this.getProducts();
      });
    }

  }

  public cancelDelete(): void {
    this.showDeletePopup = false;
  }

  private getCartItems(): void {
    this.cartService.getCartItems().subscribe(data => {
      this.cartItems = data;
    });
  }

  public addToCart(id: string): void {

    // Check if the item already exsists in the cart to update its quantity and get the id
    for (let i = 0; i < this.cartItems.length; i++) {
      const cartElement = this.cartItems[i];
      if (cartElement.productId == id) {
        this.cartItemIdToUpdate = cartElement.id;
        this.cartItemIdToUpdateQuantity = cartElement.quantity;
      }
    }

    if (this.cartItemIdToUpdate && this.cartItemIdToUpdateQuantity) {
      const body = {
        productId: id,
        quantity: this.quantities[id] + this.cartItemIdToUpdateQuantity || 1 + this.cartItemIdToUpdateQuantity
      };

      this.cartService.quantityUpdate(this.cartItemIdToUpdate, body).subscribe(() => {
        alert('Item already in cart increased its quantity');
        this.cartService.notifyCartItemAdded();
      });
    }
    else {
      // add the item in cart with its quantity
      const item = {
        productId: id,
        quantity: this.quantities[id] || 1
      };

      this.cartService.addCartItem(item).subscribe(() => {
        alert('Item added to cart');
        this.cartService.notifyCartItemAdded();
      });
    }

  }

  public updateQuantity(id: string, change: number): void {
    const currentQuantity = this.quantities[id] || 1;
    const newQuantity = Math.max(currentQuantity + change, 1); // Ensure quantity is at least 1
    this.quantities[id] = newQuantity;
  }
}
