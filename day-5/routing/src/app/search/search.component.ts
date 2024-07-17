import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

   q = {};

  constructor(private activatedRoute : ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(data => {
      this.q = data;
    })
   }

}
