import { Component } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent {

  msgTrue = false;
  categoryId:number = 3;
  subCategoryId = 103;  
  subCategoryData: any = [];
  paramId: string = '';
  isEdit = false;
  category:any  = {};
  categoryArray: any = [];

  constructor(private categoryService: CategoryService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id'))?? '';
    });

    if(this.paramId != '0') {
      this.isEdit = true;
      this.getEditData();
    }
  }

  // category form for adding category
  categoryForm = new FormGroup({
    name: new FormControl(''),

    subCategory: new FormArray([
      new FormGroup({
        name: new FormControl(''),
      })
    ])
  })

  // add new subarray field
  public addSubCategory() { 
    const subCategory = this.categoryForm.get('subCategory') as FormArray;
    subCategory.push(new FormGroup({
      name: new FormControl(''),
    }))
  }

  // adding category in the list
  public addCategory() {
    for (let i = 0; i < this.categoryForm.get('subCategory')!.value.length; i++) {

      const temp = {
        id: this.subCategoryId++,
        name: this.categoryForm.get('subCategory')!.value[i].name,
        createdAt: new Date()
      }
      this.subCategoryData.push(temp);
    }
    this.categoryArray = this.categoryService.getCategories().subscribe(data => {
      this.categoryArray = data;
    });


    const newCategoryData = {
      id: String(Math.floor(Math.random() * 100000) + 1),
      name: this.categoryForm.get('name')!.value,
      createdAt: new Date(),
      subCategory: this.subCategoryData
    }
    
    this.categoryService.addCategory(newCategoryData).subscribe(data => {
      console.log(data);
      this.msgTrue = true;
    })

   
  }
  
// getting the data to edit
  private getEditData() {
    this.categoryService.getCategoryById(this.paramId).subscribe(data =>{
      this.category = data;
      console.log(this.category);

      this.categoryForm.patchValue(this.category);
      const subCategory = this.categoryForm.get('subCategory') as FormArray;

      
     ( this.categoryForm.controls.subCategory.clear());

    
     
      
      for (let i = 0; i < this.category.subCategory.length; i++) {
        subCategory.push(new FormGroup({
          name: new FormControl(this.category.subCategory[i].name),
        }))
      }
    });
  }

  public updateData() {
    console.log(this.categoryForm.value);
    this.categoryService.updateCategory(this.paramId, this.categoryForm.value).subscribe(data => {
      console.log(data);
      this.msgTrue = true;
    })

  }

}
