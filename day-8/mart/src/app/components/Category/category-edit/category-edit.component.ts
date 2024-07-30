import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, CategoryForm, SubCategoryData, SubCategoryForm } from '../../../models/category';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {

  private subCategoryData: SubCategoryData[] = [];
  private paramId = '';
  public isEdit = false;
  private category: Category = {
    id: '',
    name: '',
    createdAt: new Date(),
    subCategory: []
  };
  public categoryArray: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id')) ?? '';
    });

    // getting the array of categories
    this.getCategoryList();

    if (this.paramId > '0') {
      this.isEdit = true;
      this.getEditData();
    }
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

  // add new subarray field
  public addSubCategory(): void {
    const subCategory = this.categoryForm.controls.subCategory;
    subCategory.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
    }));
  }

  private getCategoryList(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categoryArray = data;
    });
  }

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
      if ((this.categoryArray[i].name.toLowerCase()) === (this.categoryForm.controls.name.value)?.toLowerCase()) {
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
  }

  // getting the data to edit
  private getEditData(): void {
    this.categoryService.getCategoryById(this.paramId).subscribe(data => {
      this.category = data;

      this.categoryForm.patchValue(this.category);
      const subCategory = this.categoryForm.controls.subCategory;

      (this.categoryForm.controls.subCategory.clear());

      for (let i = 0; i < this.category.subCategory.length; i++) {
        subCategory.push(new FormGroup({
          name: new FormControl(this.category.subCategory[i].name),
        }));
      }
    });
  }

  public updateData(): void {
    this.categoryService.updateCategory(this.paramId, this.categoryForm.value).subscribe(() => {
      alert('Category Updated Successfully');
    });

    this.router.navigate(['/category']);
  }

  public removeSubCategory(index: number): void {
    const subCategory = this.categoryForm.controls.subCategory;
    subCategory.removeAt(index);
  }
}
