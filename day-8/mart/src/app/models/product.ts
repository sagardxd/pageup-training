import {  FormArray, FormControl } from "@angular/forms";

export interface ProductForm {
    brandname: FormControl<string | null>;
    cid: FormControl<string | null>;
    sellingPrice: FormControl<number | null>;
    actualPrice: FormControl<number | null>;
    discount: FormControl<number | null>;
    mediaLink: FormArray<FormControl<string | null>>;
  }
  
 export interface Product {
    id: string;
    brandname: string;
    cid: string;
    sellingPrice: number;
    actualPrice: number;
    discount: number;
    mediaLink: string[];
    createdAt: Date;
 } 