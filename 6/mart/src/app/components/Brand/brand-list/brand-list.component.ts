import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../models/brand';
import {MatDialog} from '@angular/material/dialog';
import { BrandService } from '../../../services/brand/brand.service';
import { DialogAnimationsExampleDialogComponent } from '../../Material-Components/Dialog/addbrand-dialog/dialog-animations-example-dialog.component';
import { UpdateDialogComponent } from '../../Material-Components/Dialog/updatebrand-dialog/update-dialog.component';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent implements OnInit {

  public brands: Brand[] = [];
  public searchValue = '';
  public showDeletePopup= false;
  public brandToDelete: string | null = null;

  constructor(private brandService: BrandService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getBrands();
    
    // subscribing to change in brand list change
    this.brandService.brandAdded$.subscribe(() => {
      this.getBrands();
    });
  }

  private getBrands():void {
    this.brandService.getBrands().subscribe((brands) => {
      this.brands = brands;
    });
  }

  public deleteBrand(id: string):void {
    this.showDeletePopup = true;
    this.brandToDelete = id;
  }

  public confirmDelete():void {
    if (this.brandToDelete != null) {
      this.brandService.deleteBrand(this.brandToDelete).subscribe(() => {
        this.getBrands();
        this.brandToDelete = null;
        this.showDeletePopup = false;
      });
    }
  }

  public cancelDelete():void {
    this.showDeletePopup = false;
  }

  public onChange(event: Event):void {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.searchBrand();
  }

  public searchBrand():void {
    if (this.searchValue == '') {
      this.getBrands();
    } else{
      this.brandService.searchBrand(this.searchValue).subscribe(data => {
        this.brands = data;  
    });
  }
}

// dialog 
  public  editbrand(id : string):void {
    this.dialog.open(UpdateDialogComponent, {
      width: '250px',
      data: { id: id }
    });
  }

}
