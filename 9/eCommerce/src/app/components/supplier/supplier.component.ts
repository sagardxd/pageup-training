import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { SupplierForm, SupplierFormGroup, Supply } from '../../models/supply';
import { ProductData } from '../../models/product';
import { Product } from '../../models/order';
import { productsData } from '../../utils/productData';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss',
})
export class SupplierComponent implements OnInit {
  public dialogRef: any = null;
  public orderNumber: number | null = null;
  public leaveStartDate: Date | null = null;
  public leaveEndDate: Date | null = null;
  public orderId!: number;
  public myFilter = (d: Date | null): boolean => {
    if (!d) {
      return true;
    }

    if (this.leaveStartDate && this.leaveEndDate) {
      const startDate = new Date(this.leaveStartDate);
      const endDate = new Date(this.leaveEndDate);

      return d < startDate || d > endDate;
    }

    return true;
  };

  private productData: ProductData[] = productsData;
  public productIds: Product[] = [];
  public productList: ProductData[] = [];

  constructor(private dbService: NgxIndexedDBService) {}

  ngOnInit(): void {
    this.productList = this.productData.filter((product: ProductData) => {
      return this.productIds.some(
        (id: Product) => id.productType === product.key
      );
    });
    if (this.productList.length === 1) {
      this.supplierForm.controls.suppliers.controls.forEach((supply) => {
        supply.controls.product.setValue(this.productList[0].key);
      });
    }
  }

  public supplierForm = new FormGroup<SupplierFormGroup>(
    {
      suppliers: new FormArray([
        new FormGroup<SupplierForm>({
          orderId: new FormControl(null),
          supplierRef: new FormControl(null),
          product: new FormControl(null),
          quantity: new FormControl(null),
          transportLeaveStartDate: new FormControl(null),
          transportLeaveEndDate: new FormControl(null),
        }),
      ]),
    },
    { validators: this.supplyFormValidator() }
  );

  public addSupplier(): void {
    const newSupply = new FormGroup<SupplierForm>({
      orderId: new FormControl(this.orderId),
      supplierRef: new FormControl(null),
      product: new FormControl(null),
      quantity: new FormControl(null),
      transportLeaveStartDate: new FormControl(null),
      transportLeaveEndDate: new FormControl(null),
    });
    if (this.productList.length === 1) {
      newSupply.controls.product.setValue(this.productList[0].key);
    }
    this.supplierForm.controls.suppliers.push(newSupply);
  }

  public removeSupplier(index: number): void {
    this.supplierForm.controls.suppliers.removeAt(index);
  }

  public supplyFormValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup<SupplierFormGroup>;
      const suppliers = form.controls.suppliers.controls;

      const productQuantityMap: { [key: string]: number } = {};
      let atLeastOneQuantityFilled = false;
      suppliers.forEach((supply: FormGroup<SupplierForm>) => {
        const productId = supply.controls.product.value;
        const productQuantity = supply.controls.quantity.value;

        if (productId && productQuantity !== null) {
          atLeastOneQuantityFilled = true; // Mark that a quantity has been filled

          if (productQuantityMap[productId] === undefined) {
            productQuantityMap[productId] = productQuantity;
          } else {
            productQuantityMap[productId] += productQuantity;
          }
        }
      });

      // Check if no quantities are filled
      if (!atLeastOneQuantityFilled) {
        return { ['NoProductReached']: 'No product quantity entered' };
      }

      for (const product of this.productIds) {
        const productType = product.productType;
        if (productType) {
          const expectedQuantity = productQuantityMap[productType];

          // Check if product exists in the map
          if (expectedQuantity === undefined) {
            return {
              ['EveryProductNotAvailable']: 'Every Product Not in the list',
            };
          }

          // Check if quantities match
          if (expectedQuantity !== product.productQuantity) {
            return {
              ['QuantityMismatch']: `The quantity should be ${product.productQuantity} but is ${expectedQuantity}`,
            };
          }
        }
      }

      // All products exist in the map with the same quantities
      return null;
    };
  }

  public onSubmit(): void {
    if (this.supplierForm.valid) {
      const suppliersData = this.supplierForm.value.suppliers;
      suppliersData![0].orderId = this.orderId;
      console.log('first');
      console.log(suppliersData);
      this.dbService.bulkAdd('suppliers', suppliersData!).subscribe({
        next: (key) => {
          console.log('added');
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error adding order:', error);
        },
      });
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
