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
  leaveEndDate: FormControl<string | null>;
  products: FormArray<FormGroup<ProductFormGroup>>;
  trucks: FormArray<FormGroup<TruckDataForm>>;
}
