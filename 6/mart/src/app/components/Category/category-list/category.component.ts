import { Component,  OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{

  public categorylist: Category[] = [];
  public searchParam = '';
  public showDeletePopup = false;
  public productToDelete: string | null = null;
    
  constructor(private catergoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  public getCategories():void {
    this.catergoryService.getCategories().subscribe(data =>{
      this.categorylist = data;
    });
  }

  public deleteCategory(id: string):void {
    this.showDeletePopup = true;
    this.productToDelete = id;
}

  public onChange(event: Event) :void {
    this.searchParam = (event.target as HTMLInputElement).value;
    this.searchCategory();
  }

  public searchCategory() :void {
    if (this.searchParam == '') {
      this.getCategories();
    } else{
      this.catergoryService.searchCategory(this.searchParam).subscribe(data => {
        this.categorylist = data;  
    });
  }
}

    public confirmDelete():void {
      if(this.productToDelete != null) {
        this.catergoryService.deleteCategory(this.productToDelete).subscribe(() => {
          this.getCategories();
          this.productToDelete = null;
          this.showDeletePopup = false;
        });
      }
    }

    public cancelDelete():void {
      this.showDeletePopup = false;
    }
    
}
