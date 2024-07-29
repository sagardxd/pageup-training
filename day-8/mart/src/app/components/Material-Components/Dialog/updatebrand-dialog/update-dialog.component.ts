import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BrandService } from '../../../../services/brand/brand.service';
import { Brand } from '../../../../models/brand';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrl: './update-dialog.component.scss'
})
export class UpdateDialogComponent implements OnInit {

  public brandName = '';
  private brands: Brand[] = [];


  constructor(public dialogRef: MatDialogRef<UpdateDialogComponent>,
    private brandService: BrandService,
    @Inject(MAT_DIALOG_DATA) public data: {id: string}
  ) {
    this.getBrandById(data.id);
  }

  ngOnInit(): void {
    this.getBrands();
      
  }

  private getBrands() : void{
    this.brandService.getBrands().subscribe((data) => {
      this.brands = data;
    });
  }


  public getBrandById(id: string): void{
    this.brandService.getBrandById(id).subscribe(brand => {
      this.brandName = brand.name;
    });
  }

  public updateBrand(): void {

    for (let i = 0; i < this.brands.length; i++) {
      if (this.brands[i].name === this.brandName) {
        alert('Brand Already Present');
        return;
      }
    }

    this.brandService.updateBrand(this.data.id, {name: this.brandName}).subscribe(() => {
      this.dialogRef.close();
      this.brandService.notifyBrandAdded();
      alert('Brand updated successfully');
    });

    this.getBrands();
  }
}
