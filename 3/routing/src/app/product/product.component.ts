import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  paramQuery1 = '';
  paramQuery2 = '';

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(data => {
      this.paramQuery1 = data['id'];
      this.paramQuery2 = data['id2'];
    })
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }
  
}


