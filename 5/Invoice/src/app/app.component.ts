import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Invoice';

  ngOnInit(): void {
  }

  public downloadInvoice(): void{
    const invoiceElement = document.getElementById('invoiceDiv');
    if (invoiceElement) {
      html2canvas(invoiceElement).then(canvas => {
        canvas.toBlob(blob => {
          if (blob) {
            saveAs(blob, 'invoice.png');
          }
        });
      });
    }
  }

}
