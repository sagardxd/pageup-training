import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category, CategoryForm, SubCategoryData, SubCategoryForm } from '../../../models/category';
import { CategoryService } from '../../../services/category/category.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent implements OnInit {

  constructor(private categoryService: CategoryService, private dialog: MatDialog) { }

  public categoryArray: Category[] = [];
  private subCategoryData: SubCategoryData[] = [];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCategoryList();
  }


  private getCategoryList(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categoryArray = data;
    });
  }


  // category form for adding category
  categoryForm = new FormGroup<CategoryForm>({
    name: new FormControl('', [Validators.required]),

    subCategory: new FormArray<FormGroup<SubCategoryForm>>([
      new FormGroup({
        name: new FormControl('', [Validators.required]),
      })
    ])
  });

  // adding category in the list
  public addCategory(): void {
    for (let i = 0; i < this.categoryForm.controls.subCategory.value.length; i++) {

      const temp: SubCategoryData = {
        name: this.categoryForm.controls.subCategory.value[i].name,
        createdAt: new Date()
      };
      this.subCategoryData.push(temp);
    }

    // Checking if the category is already present
    for (let i = 0; i < this.categoryArray.length; i++) {
      if (this.categoryArray[i].name.toLowerCase() === this.categoryForm.controls.name.value?.toLowerCase()) {
        alert('Category Already Present');
        return;
      }
    }


    const newCategoryData = {
      id: String(Math.floor(Math.random() * 100000) + 1),
      name: this.categoryForm.controls.name!.value,
      createdAt: new Date(),
      subCategory: this.subCategoryData
    };

    this.categoryService.addCategory(newCategoryData).subscribe(() => {
      this.categoryForm.reset();
      alert('Category Added Successfully');

    });

    this.dialog.closeAll();

  }


  public removeSubCategory(index: number): void {
    const subCategory = this.categoryForm.controls.subCategory;
    subCategory.removeAt(index);
  }


  // add new subarray field
  public addSubCategory(): void {
    const subCategory = this.categoryForm.controls.subCategory;
    subCategory.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
    }));
  }

}
