import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderComponent } from './components/order/order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SupplierComponent } from './components/supplier/supplier.component';
import { OrderDashboardComponent } from './components/order-dashboard/order-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OrderViewComponent } from './components/order-view/order-view.component';

const dbConfig: DBConfig = {
  name: 'MyAppDatabase',
  version: 1,
  objectStoresMeta: [
    {
      store: 'orders',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'orderNumber',
          keypath: 'orderNumber',
          options: { unique: true },
        },
      ],
    },
    {
      store: 'suppliers',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'orderId',
          keypath: 'orderId',
          options: { unique: false },
        },
      ],
    },
  ],
};

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    SupplierComponent,
    OrderDashboardComponent,
    OrderViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
