import { FormControl } from '@angular/forms';

export interface TruckDataForm {
  truckId: FormControl<string | null>;
  startDate: FormControl<Date | null>;
  origin: FormControl<string | null>;
  destination: FormControl<string | null>;
  capacity: FormControl<number | null>;
  product: FormControl<string | null>;
}
