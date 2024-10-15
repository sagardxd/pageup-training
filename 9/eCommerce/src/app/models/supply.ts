import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface SupplierForm {
  orderId: FormControl<number | null>;
  supplierRef: FormControl<string | null>;
  product: FormControl<string | null>;
  quantity: FormControl<number | null>;
  transportLeaveStartDate: FormControl<Date | null>;
  transportLeaveEndDate: FormControl<Date | null>;
}

export interface SupplierFormGroup {
  suppliers: FormArray<FormGroup<SupplierForm>>;
}

export interface Supply {
  supplierRef: string;
  product: string;
  quantity: number;
  transportLeaveStartDate: Date;
  transportLeaveEndDate: Date;
}
