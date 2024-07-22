import { Component, Input, input, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{

  public categorylist: any = [];
  @Input() editing = false;
    
  constructor(private catergoryService: CategoryService) { }

  ngOnInit(): void {
    this.catergoryService.getCategories().subscribe(data =>{
      this.categorylist = data;
      console.log(this.categorylist)
    });
  }


  public deleteCategory(id: number){
  }
}
