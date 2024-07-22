import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  
  index: number = 1;



  constructor() { }

  invoiceForm = new FormGroup({

    invoiceRows: new FormArray([
      new FormGroup({
        itemId: new FormControl(this.index++),
        item: new FormControl(''),
        quantity: new FormControl(),
        price: new FormControl(),
        amount: new FormControl()
      })
    ]),

    Sender: new FormGroup({
      senderCompanyName: new FormControl(''),
      senderName: new FormControl(''),
      senderAddress: new FormControl(''),
      senderState: new FormControl(''),
      senderCountry: new FormControl(''),
    }),

    Client: new FormGroup({
      clientName: new FormControl(''),
      clientCompanyName: new FormControl(''),
      clientAddress: new FormControl(''),
      clientState: new FormControl(''),
      clientCountry: new FormControl(''),
    }),

    InvoiceDetails: new FormGroup({
      invoiceNumber: new FormControl(''),
      invoiceDate: new FormControl(''),
      invoiceDueDate: new FormControl(''),
    }),

  })

  get invoiceRows(): FormArray {
    return this.invoiceForm.get('invoiceRows') as FormArray;
  }

  addNewRow() {
    const newItem = new FormGroup({
      itemId: new FormControl(this.index++),
      item: new FormControl(''),
      quantity: new FormControl(),
      price: new FormControl(),
      amount: new FormControl()
    });

    this.invoiceRows.push(newItem);
  }

  getFormValue() {
    console.log(this.invoiceForm.value);
  }


}
