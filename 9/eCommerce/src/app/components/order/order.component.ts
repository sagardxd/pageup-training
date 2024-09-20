import { Component } from '@angular/core';
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

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  public productsList = productsData;

  constructor() {
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
  }

  public orderForm = new FormGroup<OrderDetailsForm>({
    orderNumber: new FormControl(null),
    origin: new FormControl(null, [Validators.minLength(2)]),
    originValue: new FormControl('none'),
    destination: new FormControl(null, [Validators.minLength(2)]),
    destinationValue: new FormControl('none'),
    leaveStartDate: new FormControl(null),
    bookedRentalDays: new FormControl(null),
    leaveEndDate: new FormControl({ value: null, disabled: true }),
    products: new FormArray<FormGroup<ProductFormGroup>>(
      [],
      [this.productArrayValidator()]
    ),
    trucks: new FormArray<FormGroup<TruckDataForm>>(
      [],
      [this.truckShipmentValidator]
    ),
  });

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

      this.orderForm.controls.leaveEndDate.setValue(formattedDate);
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

  private truckShipmentValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const truckArray = form as FormArray;
      const origin = [];
      const destination = [];
      return null;
    };
  }

  // private shippingValidator() {
  //   const origin = this.orderForm.controls.origin.value;
  //   const destination = this.orderForm.controls.destination.value;

  //   if (origin && destination) {
  //     const filteredTruck = this.truckList.trucks.filter(
  //       (truck) =>
  //         truck.origin === origin.toUpperCase() &&
  //         truck.destination === destination.toUpperCase()
  //     );
  //     if (filteredTruck) {
  //       this.addTruckData(filteredTruck);
  //     }
  //   }
  // }

  public addProductInForm(): void {
    const newProductGroup = new FormGroup<ProductFormGroup>({
      productType: new FormControl(null),
      productQuantity: new FormControl(null),
    });

    this.orderForm.controls.products.push(newProductGroup);
    console.log(this.orderForm.value);
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
      capacity: new FormControl(null),
      origin: new FormControl(null),
      destination: new FormControl(null),
      startDate: new FormControl(null),
      product: new FormControl(null),
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
}
