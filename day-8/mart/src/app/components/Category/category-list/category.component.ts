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
    let text = 'Are you sure you want to delete this category?';
    if (confirm(text)) {
    this.catergoryService.deleteCategory(id).subscribe(data => {
      console.log("deleted");
      this.getCategories()
    })
  }
}
}
