import { Component, TRANSLATIONS } from '@angular/core';
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

    this.orderForm.controls.trucks.valueChanges.subscribe(() => {
      this.checkTruckForm();
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
    trucks: new FormArray<FormGroup<TruckDataForm>>([]),
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

  private checkTruckForm(): void {
    if (this.orderForm.controls.trucks.valid) {
      console.log(this.orderForm.controls.trucks.valid);
      this.truckArrayValidator();
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
    const orderOrigin = this.orderForm.controls.origin.value;
    const orderDestination = this.orderForm.controls.destination.value;

    const trucksArray = this.orderForm.controls.trucks as FormArray;
    const productsArray = this.orderForm.controls.products as FormArray;
    const originArray: string[] = [];
    const destinationArray: string[] = [];

    let hasError = false;

    const availableProducts: {
      [key: string]: { productType: string; productQuantity: number }[];
    } = {};

    // Build available products mapping
    productsArray.controls.forEach((productsControl: AbstractControl) => {
      const product = productsControl as FormGroup<ProductFormGroup>;
      const productType = product.controls.productType.value;
      const productQuantity = product.controls.productQuantity.value || 0;

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

    console.log('Products at Origin:', availableProducts);

    // Reset errors for all trucks before revalidation
    trucksArray.controls.forEach((control: AbstractControl) => {
      const truckControl = control as FormGroup<TruckDataForm>;
      truckControl.setErrors(null); // Clear existing errors
    });

    // Validate each truck
    trucksArray.controls.forEach((control: AbstractControl) => {
      const truckControl = control as FormGroup<TruckDataForm>;

      const truckOrigin = truckControl.controls.origin.value;
      const truckDestination = truckControl.controls.destination.value;
      const truckProduct = truckControl.controls.product.value;
      const truckQuantity = truckControl.controls.quantity.value;

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
        if (!originArray.includes(orderOrigin)) {
          truckControl.setErrors({ invalidOrigin: 'Invalid origin' });
          hasError = true;
        }

        if (destinationArray.includes(orderDestination)) {
          truckControl.setErrors({ invalidDestination: 'Invalid destination' });
          hasError = true;
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
            hasError = true;
          }
        }

        // Validate routes
        for (let i = 0; i < destinationArray.length; i++) {
          if (destinationArray[i] !== orderDestination) {
            if (!originArray.includes(destinationArray[i])) {
              // truckControl.setErrors({ notValid: 'Invalid routes' });
              // hasError = true;
            }
          }
        }
      }
    });


    // Only return errors at the end
    return hasError ? { truckArrayInvalid: true } : null;
  }




  public addProductInForm(): void {
    const newProductGroup = new FormGroup<ProductFormGroup>({
      productType: new FormControl(null),
      productQuantity: new FormControl(null),
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
}
