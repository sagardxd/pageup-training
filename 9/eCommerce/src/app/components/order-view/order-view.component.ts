import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { OrderDetails } from '../../models/order';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.scss',
})
export class OrderViewComponent {
  orderValue: OrderDetails | null = null;
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private dbService: NgxIndexedDBService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('id');
      this.getOrderByOrderNumber(Number(this.orderId));
    });
  }

  public getOrderByOrderNumber(orderNumber: number): void {
    if (orderNumber) {
      this.dbService.getByKey('orders', orderNumber).subscribe(
        (order) => {
          if (order) {
            this.orderValue = order as OrderDetails;
          }
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  }
}
