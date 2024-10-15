import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TruckDataForm } from './truck';
import { ProductFormGroup } from './product';

export interface OrderDetailsForm {
  orderNumber: FormControl<number | null>;
  origin: FormControl<string | null>;
  originValue: FormControl<string | null>;
  destination: FormControl<string | null>;
  destinationValue: FormControl<string | null>;
  leaveStartDate: FormControl<Date | null>;
  bookedRentalDays: FormControl<number | null>;
  leaveEndDate: FormControl<Date | null>;
  products: FormArray<FormGroup<ProductFormGroup>>;
  trucks: FormArray<FormGroup<TruckDataForm>>;
}

export interface Product {
  productType: string | null;
  productQuantity: number | null;
}

export interface Truck {
  truckId: string | null;
  startDate: Date | null;
  origin: string | null;
  destination: string | null;
  quantity: number | null;
  product: string | null;
}

export interface OrderDetails {
  id: number;
  orderNumber: number | null;
  origin: string | null;
  originValue: string | null;
  destination: string | null;
  destinationValue: string | null;
  leaveStartDate: Date | null;
  bookedRentalDays: number | null;
  leaveEndDate: Date | null;
  products: Product[];
  trucks: Truck[];
}
