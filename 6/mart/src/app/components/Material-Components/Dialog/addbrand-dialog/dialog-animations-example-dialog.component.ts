import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BrandService } from '../../../../services/brand/brand.service';
import { Brand } from '../../../../models/brand';

@Component({
  selector: 'app-dialog-animations-example-dialog',
  templateUrl: './dialog-animations-example-dialog.component.html',
  styleUrl: './dialog-animations-example-dialog.component.scss'
})
export class DialogAnimationsExampleDialogComponent implements OnInit {

  public brandname = '';
  private brands: Brand[] = [];

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialogComponent>,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.getBrands();
  }

  private getBrands(): void {
    this.brandService.getBrands().subscribe((data) => {
      this.brands = data;
    });
  }

  public addBrand(): void {

    if (this.brandname == '') {
      alert("Brandname is empty");
      return;
    }

    const data = {
      id: Math.floor(Math.random() * 1000).toString(),
      name: this.brandname,
      createdAt: new Date
    };


    for (let i = 0; i < this.brands.length; i++) {
      if (this.brands[i].name.toLowerCase() === this.brandname.toLowerCase()) {
        alert('Brand Already Present');
        return;
      }
    }

    this.brandService.addBrand(data).subscribe(() => {
      this.dialogRef.close();
      this.brandService.notifyBrandAdded();
      alert('Added brand');
    });

    this.getBrands();
  }
}
