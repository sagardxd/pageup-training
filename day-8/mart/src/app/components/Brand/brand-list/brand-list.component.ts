import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand/brand.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent implements OnInit {

  public brands: Brand[] = [];
  public searchValue: string = '';
  public showDeletePopup: boolean = false;
  public brandToDelete: string | null = null;

  constructor(private brandService: BrandService) { }

  ngOnInit(): void {
    this.getBrands();
  }

  private getBrands() {
    this.brandService.getBrands().subscribe((brands) => {
      this.brands = brands;
    });
  }

  public deleteBrand(id: string) {
    this.showDeletePopup = true;
    this.brandToDelete = id;
  }

  public confirmDelete() {
    if (this.brandToDelete != null) {
      this.brandService.deleteBrand(this.brandToDelete).subscribe(data => {
        this.getBrands();
        this.brandToDelete = null;
        this.showDeletePopup = false;
      });
    }
  }

  public cancelDelete() {
    this.showDeletePopup = false
  }

  public onChange(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.searchBrand();
  }

  public searchBrand() {
    if (this.searchValue == '') {
      this.getBrands();
    } else{
      this.brandService.searchBrand(this.searchValue).subscribe(data => {
        this.brands = data;  
    });
  }
}

}
