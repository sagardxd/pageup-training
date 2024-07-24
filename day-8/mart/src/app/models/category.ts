import { Form, FormArray, FormControl, FormGroup } from "@angular/forms";

export interface SubCategoryForm {
    name: FormControl<string | null>;
}

export interface CategoryForm {
    name: FormControl<string | null>;
    subCategory: FormArray<FormGroup<SubCategoryForm>>;
}

export interface SubCategory {
    id: number;
    name: string;
    createdAt: Date;
}

export interface Category {
    id: string
    name: string;
    createdAt: Date;
    subCategory: SubCategory[];
}

export interface SubCategoryData{
    name : string | null | undefined,
    createdAt : Date,
}

