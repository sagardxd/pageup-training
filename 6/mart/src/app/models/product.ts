import {  FormArray, FormControl } from "@angular/forms";

export interface ProductForm {
   productname: FormControl<string | null>;
    cid: FormControl<string | null>;
    brandid: FormControl<string | null>;
    sellingPrice: FormControl<number | null>;
    actualPrice: FormControl<number | null>;
    discount: FormControl<number | null>;
    mediaLink: FormArray<FormControl<string | null>>;
  }
  
 export interface Product {
    id: string;
    productname: string;
    cid: string;
    brandid: string;
    sellingPrice: number;
    actualPrice: number;
    discount: number;
    mediaLink: string[];
    createdAt: Date;
 } 