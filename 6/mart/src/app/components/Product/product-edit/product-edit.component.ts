import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { Product, ProductForm } from '../../../models/product';
import { Category } from '../../../models/category';
import { BrandService } from '../../../services/brand/brand.service';
import { Brand } from '../../../models/brand';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../Category/category-dialog/category-dialog.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {

  public paramId = '';
  public categoryArray: Category[] = [];
  public brandArray: Brand[] = [];
  public currProduct: Product = {
    id: '',
    productname: '',
    cid: '',
    brandid: '',
    sellingPrice: 0,
    actualPrice: 0,
    discount: 0,
    mediaLink: [],
    createdAt: new Date()
  };
  public edit = false;
  private productArray: Product[] = [];

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService, private router: Router,
    private brandService: BrandService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id')) ?? '';
    });

    this.categoryService.getCategories().subscribe(data => {
      this.categoryArray = data;
    });

    this.getBrands();

    //sunscribe to brand added event
    this.brandService.brandAdded$.subscribe(() => {
      this.getBrands();
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

  private getBrands(): void {
    this.brandService.getBrands().subscribe(data => {
      this.brandArray = data;
    });
  }

  private sellingPriceMoreThanActualPrice(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const sellingPrice = group.controls['sellingPrice']?.value;
      const actualPrice = group.controls['actualPrice']?.value;
      const discount = group.controls['discount']?.value;

      const errors: ValidationErrors = {};

      if (sellingPrice != null && actualPrice != null && sellingPrice > actualPrice) {
        errors['sellingPriceMoreThanActualPrice'] = true;
      }

      if (discount != null && discount < 0) {
        errors['negativeDiscount'] = true;
      }
      return Object.keys(errors).length ? errors : null;
    };
  }


  public productForm: FormGroup<ProductForm> = new FormGroup<ProductForm>({
    productname: new FormControl(null, [Validators.required]),
    cid: new FormControl(null, [Validators.required]),
    brandid: new FormControl(null, [Validators.required]),
    sellingPrice: new FormControl(null, [Validators.required, Validators.min(0)]),
    actualPrice: new FormControl(null, [Validators.required, Validators.min(0)]),
    discount: new FormControl({ value: null, disabled: true }),
    mediaLink: new FormArray([new FormControl('', [Validators.required])]),
  }, { validators: this.sellingPriceMoreThanActualPrice() });




  private calculateDiscount(): void {
    const sellingPrice = this.productForm.controls.sellingPrice.value;
    const actualPrice = this.productForm.controls.actualPrice.value;

    if (sellingPrice != null && actualPrice != null && actualPrice > 0) {
      const discount = ((actualPrice - sellingPrice) / actualPrice) * 100;
      this.productForm.controls.discount.setValue(parseInt(discount.toFixed(2)), { emitEvent: false });
    } else {
      this.productForm.controls.discount.setValue(0, { emitEvent: false });
    }
  }

  public addLink(): void {
    const mediaLink = this.productForm.controls.mediaLink;
    mediaLink.push(new FormControl('', [Validators.required]));
  }

  public submit(): void {

    const formValue = this.productForm.value;
    const dataToSend = {
      ...formValue,
      sellingPrice: Number(formValue.sellingPrice),
      actualPrice: Number(formValue.actualPrice),
      discount: Number(((formValue.actualPrice! - formValue.sellingPrice!) / formValue.actualPrice!) * 100)
    };

    // checking if the product exsists
    const productExists = this.productArray.find(product => product.productname.toLowerCase() === formValue.productname?.toLocaleLowerCase());
    if (productExists) {
      alert('Product already exists');
      return;
    }

    this.productService.addProduct(dataToSend).subscribe(() => {
      this.productForm.reset();
      alert('Product Added Successfully');
    });
  }

  private getEditData(): void {
    this.productService.getProductById(this.paramId).subscribe(data => {
      this.currProduct = data;
      this.productForm.patchValue(data);

      this.productForm.controls.mediaLink.clear();
      for (let i = 0; i < this.currProduct.mediaLink.length; i++) {
        const mediaLink = this.productForm.controls.mediaLink;
        mediaLink.push(new FormControl());
        this.productForm.patchValue(data);
      }
    });
  }

  public update(): void {
    this.productService.updateProduct(this.paramId, this.productForm.value).subscribe(() => {
      this.router.navigate(['/product']);
      alert('Product Updated Successfully');
    });
  }

  public removeLink(index: number): void {
    this.productForm.controls.mediaLink.removeAt(index);
  }

  public openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '700px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.categoryService.getCategories().subscribe(data => {
        this.categoryArray = data;
      });
    });

  }


}