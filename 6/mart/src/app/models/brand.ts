import { FormControl } from "@angular/forms";

export interface Brand {
    id: string;
    name: string;
    createdAt: Date;
}

export interface BrandForm {
    name: FormControl<string | null>;
}