import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent {

  paramId: string = '';
  categoryArray: any = [];
  edit = false;
  msg = false;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService) { }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id')) ?? '';
    });

    this.categoryService.getCategories().subscribe(data => {
      this.categoryArray = data;
      console.log(this.categoryArray)
    });

    if (this.paramId != '0') {
      this.edit = true;
      this.getEditData();
    }
  }

  public productForm = new FormGroup({
    brandname: new FormControl(''),
    cid: new FormControl(''),
    sellingPrice: new FormControl(''),
    actualPrice: new FormControl(''),
    discount: new FormControl(''),
    mediaLink: new FormArray([
      new FormControl('')
    ])
  });

  public addLink() { 
    const mediaLink = this.productForm.controls.mediaLink as FormArray;
    mediaLink.push(new FormControl(''));
  }

  public submit() {
    this.productService.addProduct(this.productForm.value).subscribe(data => {
      console.log(data);
    })
  }
   
  private getEditData() {
    this.productService.getProductById(this.paramId).subscribe(data => {
      this.productForm.patchValue(data);
    })
  }

  public update() {
    this.productService.updateProduct(this.paramId, this.productForm.value).subscribe(data => {
      this.msg = true;
    })
    console.log(this.productForm.value)
  }



}
