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
  private cartItems: CartItem[] = [];
  public searchParam = '';
  private productToDelete: string | null = null;
  public showDeletePopup = false;
  constructor(private productService: ProductService, private cartService: CartService) {}

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
    const item = {
      productId: id,
      quantity: 1
    };
    if (this.cartItems.find(x => x.productId == id)) {
      alert('Item already in cart');
    } else{
    this.cartService.addCartItem(item).subscribe(() => {
        alert('Item added to cart');
        this.cartService.notifyCartItemAdded();
      });
    }
  }

}
