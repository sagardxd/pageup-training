import { Component, Input, input, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{

  public categorylist: Category[] = [];
  public searchParam: string = '';
  public showDeletePopup: boolean = false;
  public productToDelete: string | null = null;
    
  constructor(private catergoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  public getCategories(){
    this.catergoryService.getCategories().subscribe(data =>{
      this.categorylist = data;
    });
  }

  public deleteCategory(id: string){
    this.showDeletePopup = true;
    this.productToDelete = id;
}

  public onChange(event: Event) {
    this.searchParam = (event.target as HTMLInputElement).value;
    this.searchCategory();
  }

  public searchCategory() {
    if (this.searchParam == '') {
      this.getCategories();
    } else{
      this.catergoryService.searchCategory(this.searchParam).subscribe(data => {
        this.categorylist = data;  
    });
  }
}

    public confirmDelete(){
      if(this.productToDelete != null) {
        this.catergoryService.deleteCategory(this.productToDelete).subscribe(data => {
          this.getCategories();
          this.productToDelete = null;
          this.showDeletePopup = false
        })
      }
    }

    public cancelDelete(){
      this.showDeletePopup = false
    }
    
}
