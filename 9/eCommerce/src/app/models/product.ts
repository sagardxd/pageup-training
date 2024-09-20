import { FormControl } from '@angular/forms';

export interface ProductFormGroup {
  productType: FormControl<string | null>;
  productQuantity: FormControl<number | null>;
}
