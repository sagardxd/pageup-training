import { Component, inject, TRANSLATIONS } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { OrderDetailsForm } from '../../models/order';
import { ProductFormGroup } from '../../models/product';
import { TruckDataForm } from '../../models/truck';
import { cityStationCode } from '../../utils/cityData';
import { productsData } from '../../utils/productData';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  public productsList = productsData;
  public hasError = false;
  public myFilter = (d: Date | null): boolean => {
    // Get the start and end dates from the form
    const leaveStartDate = this.orderForm.controls.leaveStartDate.value;
    const leaveEndDate = this.orderForm.controls.leaveEndDate.value;

    if (!leaveStartDate) {
      return true;
    }

    const date = d || new Date();

    // Check if the date is within the range of leaveStartDate and leaveEndDate
    const startDate = new Date(leaveStartDate);
    const endDate = leaveEndDate ? new Date(leaveEndDate) : null;

    return (!endDate || date <= endDate) && date >= startDate;
  };
  private _snackBar = inject(MatSnackBar);

  constructor(private dbService: NgxIndexedDBService) {
    this.bindValueChangeHandler(
      this.orderForm.controls.origin,
      this.orderForm.controls.originValue
    );
    this.bindValueChangeHandler(
      this.orderForm.controls.destination,
      this.orderForm.controls.destinationValue
    );

    this.orderForm.controls.leaveStartDate.valueChanges.subscribe(() => {
      this.updateLeaveEndDate();
    });
    this.orderForm.controls.bookedRentalDays.valueChanges.subscribe(() => {
      this.updateLeaveEndDate();
    });

    this.orderForm.valueChanges.subscribe(() => {
      this.truckArrayValidator();
    });
  }

  public orderForm = new FormGroup<OrderDetailsForm>({
    orderNumber: new FormControl(null, [Validators.required]),
    origin: new FormControl(null, [Validators.minLength(2)]),
    originValue: new FormControl('none'),
    destination: new FormControl(null, [Validators.minLength(2)]),
    destinationValue: new FormControl('none'),
    leaveStartDate: new FormControl(null, [Validators.required]),
    bookedRentalDays: new FormControl(null, [Validators.required]),
    leaveEndDate: new FormControl({ value: null, disabled: true }),
    products: new FormArray<FormGroup<ProductFormGroup>>(
      [],
      [this.productArrayValidator()]
    ),
    trucks: new FormArray<FormGroup<TruckDataForm>>([]),
  });

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  private bindValueChangeHandler(
    controlName: FormControl,
    valueControlName: FormControl
  ): void {
    controlName.valueChanges.subscribe((originalValue) => {
      if (originalValue && originalValue.length > 2) {
        const stationCode = originalValue.toUpperCase();
        const filteredCity = cityStationCode[stationCode];

        if (filteredCity) {
          valueControlName.setValue(filteredCity);
        } else {
          valueControlName.setValue('none');
        }
      }
    });
  }

  private updateLeaveEndDate() {
    const leaveStartDate = this.orderForm.controls.leaveStartDate?.value;
    const bookedRentalDays = this.orderForm.controls.bookedRentalDays?.value;

    if (leaveStartDate && bookedRentalDays) {
      const expectedEndDate = new Date(leaveStartDate);
      expectedEndDate.setDate(expectedEndDate.getDate() + bookedRentalDays);

      const day = ('0' + expectedEndDate.getDate()).slice(-2);
      const month = ('0' + (expectedEndDate.getMonth() + 1)).slice(-2);
      const year = expectedEndDate.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;

      this.orderForm.controls.leaveEndDate.setValue(
        formattedDate as unknown as Date
      );
    }
  }

  private productArrayValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const array = form as FormArray;
      const productTypes = new Set<string>();

      array.controls.forEach((element) => {
        const control = element as FormGroup<ProductFormGroup>;
        const productType = control.controls.productType.value;

        // Clear previous errors
        control.controls.productType.setErrors(null);

        if (productType) {
          if (productTypes.has(productType)) {
            // Mark this control as having a duplicate product type
            control.controls.productType.setErrors({ duplicateProduct: true });
          } else {
            productTypes.add(productType);
          }
        }
      });

      return null;
    };
  }

  public truckArrayValidator(): ValidationErrors | null {
    // returning null if the value of orderform is not filled
    if (
      this.orderForm.controls.bookedRentalDays.value === null ||
      this.orderForm.controls.destination.value === null ||
      this.orderForm.controls.origin.value === null ||
      this.orderForm.controls.leaveStartDate.value === null ||
      this.orderForm.controls.products.value === null
    ) {
      return null;
    }
    this.hasError = false;
    const orderOrigin = this.orderForm.controls.origin.value;
    const orderDestination = this.orderForm.controls.destination.value;

    const trucksArray = this.orderForm.controls.trucks as FormArray;
    const productsArray = this.orderForm.controls.products as FormArray;
    const originArray: string[] = [];
    const destinationArray: string[] = [];
    let totalProductsQuantity = 0;

    const availableProducts: {
      [key: string]: { productType: string; productQuantity: number }[];
    } = {};

    // Build available products mapping
    productsArray.controls.forEach((productsControl: AbstractControl) => {
      const product = productsControl as FormGroup<ProductFormGroup>;
      const productType = product.controls.productType.value;
      const productQuantity = product.controls.productQuantity.value || 0;
      totalProductsQuantity += productQuantity;

      if (productType && orderOrigin) {
        if (!availableProducts[orderOrigin]) {
          availableProducts[orderOrigin] = [];
        }
        availableProducts[orderOrigin].push({
          productType: productType,
          productQuantity: productQuantity,
        });
      }
    });
    console.log(availableProducts);

    // Reset errors for all trucks before validation
    trucksArray.controls.forEach((control: AbstractControl) => {
      const truckControl = control as FormGroup<TruckDataForm>;
      truckControl.setErrors(null);
    });

    // Validate each truck
    trucksArray.controls.forEach((control: AbstractControl) => {
      const truckControl = control as FormGroup<TruckDataForm>;

      const truckOrigin = truckControl.controls.origin.value;
      const truckDestination = truckControl.controls.destination.value;
      const truckProduct = truckControl.controls.product.value;
      const truckQuantity = truckControl.controls.quantity.value;

      // transport origin and destination are the same
      if (truckOrigin && truckDestination && truckOrigin == truckDestination) {
        truckControl.setErrors({
          sameOriginAndDestination: `Transport origin and destination cant be same`,
        });
        this.hasError = true;
      }

      if (
        truckOrigin &&
        truckDestination &&
        orderOrigin &&
        orderDestination &&
        truckProduct &&
        truckQuantity
      ) {
        originArray.push(truckOrigin);
        destinationArray.push(truckDestination);

        // Validate truck origin and destination
        // origin can be orderOrigin or any destination
        if (
          truckOrigin != orderOrigin &&
          !destinationArray.includes(truckOrigin)
        ) {
          truckControl.setErrors({ invalidOrigin: 'Invalid origin' });
        }

        // Validate product quantity at origin
        if (availableProducts[truckOrigin]) {
          const productQuantityUpdate = availableProducts[truckOrigin].find(
            (p) => p.productType === truckProduct
          );
          if (
            productQuantityUpdate &&
            productQuantityUpdate.productQuantity >= truckQuantity
          ) {
            // Update product quantity and transfer to destination
            productQuantityUpdate.productQuantity -= truckQuantity;
            if (!availableProducts[truckDestination]) {
              availableProducts[truckDestination] = [];
            }
            availableProducts[truckDestination].push({
              productType: truckProduct,
              productQuantity: truckQuantity,
            });
          } else {
            truckControl.setErrors({
              insufficientQuantity: `Not enough quantity for product ${truckProduct} at origin ${truckOrigin}`,
            });
            this.hasError = true;
          }
        }
      }
    });

    // Validate routes
    // for (let i = 0; i < destinationArray.length; i++) {
    //   if (destinationArray[i] !== orderDestination) {
    //     if (!originArray.includes(destinationArray[i])) {
    //       trucksArray.setErrors({ notValid: 'Invalid routes ' });
    //       this.hasError = true;
    //     }
    //   }
    // }

    // validating that every other pincode has 0 products and all the prouducts are in the orderdestination
    for (let i = 0; i < originArray.length; i++) {
      availableProducts[originArray[i]].forEach((product) => {
        if (product.productQuantity !== 0) {
          this.hasError = true;
          trucksArray.setErrors({
            originHasProductsLeft: 'All products are not deported from origin',
          });
        }
      });
    }

    // checking if the all the procduct are reached at the destination
    if (orderDestination) {
      let destinationProductQuantity = 0;

      if (availableProducts[orderDestination]) {
        availableProducts[orderDestination].forEach((product) => {
          destinationProductQuantity += product.productQuantity;
        });
      }

      if (destinationProductQuantity !== totalProductsQuantity) {
        this.hasError = true;
        trucksArray.setErrors({
          notAllProductReachedDestination:
            'All products are not received at the destination',
        });
      }
    }

    return null;
  }

  public addProductInForm(): void {
    const newProductGroup = new FormGroup<ProductFormGroup>({
      productType: new FormControl(null, [Validators.required]),
      productQuantity: new FormControl(null, [Validators.required]),
    });

    this.orderForm.controls.products.push(newProductGroup);
  }

  public removeProduct(index: number): void {
    const productArray = this.orderForm.controls.products;

    for (let i = 0; i < productArray.length; i++) {
      if (i === index) {
        productArray.removeAt(index);
      }
    }
  }

  public addTruckInForm(): void {
    const trucks = this.orderForm.controls.trucks;
    const newTruck = new FormGroup<TruckDataForm>({
      truckId: new FormControl(null),
      startDate: new FormControl(null),
      origin: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      destination: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      product: new FormControl(null, [Validators.required]),
    });
    trucks.push(newTruck);
  }

  public removeTruckInForm(index: number): void {
    const truckArray = this.orderForm.controls.trucks;

    for (let i = 0; i < truckArray.length; i++) {
      if (i === index) {
        truckArray.removeAt(index);
      }
    }
  }

  public saveOrder(): void {
    const data = this.orderForm.value;
    this.dbService.add('orders', data).subscribe({
      next: (key) => {
        this.openSnackBar('Added Order', 'Close');
        this.orderForm.reset();
        this.orderForm.controls.products.controls = [];
        this.orderForm.controls.trucks.controls = [];
      },
      error: (error) => {
        console.error('Error adding order:', error);
      },
    });
  }
}
