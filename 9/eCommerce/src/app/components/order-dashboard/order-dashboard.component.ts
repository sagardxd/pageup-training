import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { OrderDetails } from '../../models/order';
import { Dialog } from '@angular/cdk/dialog';
import { SupplierComponent } from '../supplier/supplier.component';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrl: './order-dashboard.component.scss',
})
export class OrderDashboardComponent {
  public orders: OrderDetails[] | null = null;

  constructor(private dbService: NgxIndexedDBService, private dialog: Dialog) {
    this.getAllOrders();
  }

  public getAllOrders(): void {
    this.dbService.getAll('orders').subscribe(
      (orders: any) => {
        this.orders = orders.map((order: OrderDetails) => ({
          ...order,
          leaveEndDate: this.calculateEndDate(
            order.leaveStartDate,
            order.bookedRentalDays
          ),
        }));
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  private calculateEndDate(
    startDate: Date | null,
    bookedDays: number | null
  ): Date | null {
    if (!startDate || bookedDays === null) {
      return null;
    }
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + bookedDays);
    return endDate;
  }

  public openSupplierDialog(order: OrderDetails): void {
    const dialog = this.dialog.open(SupplierComponent, {
      disableClose: true,
    });
    if (dialog.componentInstance) {
      dialog.componentInstance.dialogRef = dialog;
      dialog.componentInstance.leaveStartDate = order.leaveStartDate;
      dialog.componentInstance.leaveEndDate = order.leaveEndDate;
      dialog.componentInstance.productIds = order.products;
      dialog.componentInstance.orderId = order.id;
    }
  }
}
