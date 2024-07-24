import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  public productList: Product[] = [];
  public searchParam: string = '';
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  changeInSearch(event: { target: { value: string; } }) {
    this.searchParam = event.target.value;
  }

  public getProducts(){
    this.productService.getProducts().subscribe(data =>{
      this.productList = data;
    });
  }

  public deleteProduct(id: string){
    let text = 'Are you sure you want to delete this product?';
    if (confirm(text)) {
    this.productService.deleteProduct(id).subscribe(data => {
      console.log("deleted");
      this.getProducts();
    })
  }
}

  public onChange(event: any) {
    this.searchParam = event.target.value;
    this.searchProduct();
  }

  public searchProduct() {
    if (this.searchParam == '') {
      this.getProducts();
    } else{
      this.productService.searchProduct(this.searchParam).subscribe(data => {
        this.productList = data;  
    });
  }
}

}
