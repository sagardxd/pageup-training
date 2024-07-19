import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Invoice';

  index: number = 1;


  constructor() { }

  invoiceRowForm = new FormArray([
    new FormGroup({
      itemId: new FormControl(this.index++),
      item: new FormControl(''),
      quantity: new FormControl(),
      price: new FormControl(),
      amount: new FormControl()
    })
  ])

  private getArray() {
    return this.invoiceRowForm;
  }

  public addNewRow() {
    const newItem = new FormGroup({
      itemId: new FormControl(this.index++),
      item: new FormControl(''),
      quantity: new FormControl(),
      price: new FormControl(),
      amount: new FormControl()
    });

    this.invoiceRowForm.push(newItem);
  }


}
