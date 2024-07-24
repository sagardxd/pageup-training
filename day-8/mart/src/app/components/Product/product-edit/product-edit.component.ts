import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Product, ProductForm } from '../../../models/product';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent {

  public paramId: string = '';
  public categoryArray: Category[] = [];
  public currProduct: Product = {
    id: '',
    brandname: '',
    cid: '',
    sellingPrice: 0,
    actualPrice: 0,
    discount: 0,
    mediaLink: [],
    createdAt: new Date()
  };
  public edit: boolean = false;
  private productArray: Product[] = [];

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id')) ?? '';
    });

    this.categoryService.getCategories().subscribe(data => {
      this.categoryArray = data;
      console.log(this.categoryArray)
    });

    this.productService.getProducts().subscribe(data => {
      this.productArray = data;
    });

    if (this.paramId != '') {
      this.edit = true;
      this.getEditData();
    }

    this.productForm.valueChanges.subscribe(() => {
      this.calculateDiscount();
    });
  }

  private discountNonNegative(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const sellingPrice = group.controls['sellingPrice'].value;
      const actualPrice = group.controls['actualPrice'].value;

      if (sellingPrice != null && actualPrice != null && actualPrice > 0) {
        const discount = ((actualPrice - sellingPrice) / actualPrice) * 100;

        return discount < 0 ? { discountNegative: true } : null;
      }
      return null;
    };
  }


  public productForm: FormGroup<ProductForm> = new FormGroup<ProductForm>({
    brandname: new FormControl(null, [Validators.required]),
    cid: new FormControl(null, [Validators.required]),
    sellingPrice: new FormControl(null, [Validators.required, Validators.min(0)]),
    actualPrice: new FormControl(null),
    discount: new FormControl({ value: null, disabled: true }),
    mediaLink: new FormArray([new FormControl('', [Validators.required])]),
  }, { validators: this.discountNonNegative() });




  private calculateDiscount() {
    const sellingPrice = this.productForm.controls.sellingPrice.value;
    const actualPrice = this.productForm.controls.actualPrice.value;

    if (sellingPrice != null && actualPrice != null && actualPrice > 0) {
      const discount = ((actualPrice - sellingPrice) / actualPrice) * 100;
      this.productForm.controls.discount.setValue(parseInt(discount.toFixed(2)), { emitEvent: false });
    } else {
      this.productForm.controls.discount.setValue(0, { emitEvent: false });
    }
  }

  public addLink() {
    const mediaLink = this.productForm.controls.mediaLink;
    mediaLink.push(new FormControl('', [Validators.required]));
  }

  public submit() {

    const formValue = this.productForm.value;
    console.log(formValue)
    const dataToSend = {
      ...formValue,
      sellingPrice: Number(formValue.sellingPrice),
      actualPrice: Number(formValue.actualPrice),
      discount: Number(((formValue.actualPrice! - formValue.sellingPrice!) / formValue.actualPrice!) * 100)
    }

    // checking if the product exsists
    const productExists = this.productArray.find(product => product.brandname === formValue.brandname);
    if (productExists) {
      alert('Product already exists');
      return;
    }

    this.productService.addProduct(dataToSend).subscribe(data => {
      this.productForm.reset();
      alert('Product Added Successfully');
    })
  }

  private getEditData() {
    this.productService.getProductById(this.paramId).subscribe(data => {
      this.currProduct = data;
      this.productForm.controls.mediaLink.clear();
      for (let i = 0; i < this.currProduct.mediaLink.length; i++) {
        const mediaLink = this.productForm.controls.mediaLink;
        mediaLink.push(new FormControl());
        this.productForm.patchValue(data);
      }
    })
  }

  public update() {
    this.productService.updateProduct(this.paramId, this.productForm.value).subscribe(data => {
      this.router.navigate(['/product'])
      alert('Product Updated Successfully');
    })
  }

  public removeLink(index: number) {
    this.productForm.controls.mediaLink.removeAt(index);
  }
}
