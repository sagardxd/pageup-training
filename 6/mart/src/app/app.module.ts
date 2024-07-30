import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './components/Category/category-list/category.component';
import { CategoryEditComponent } from './components/Category/category-edit/category-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './components/Product/product-list/product.component';
import { ProductEditComponent } from './components/Product/product-edit/product-edit.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrandListComponent } from './components/Brand/brand-list/brand-list.component';
import { CartPageComponent } from './components/Cart/cart-page/cart-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DialogComponent } from './components/Material-Components/Dialog/dialog/dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogAnimationsExampleDialogComponent } from './components/Material-Components/Dialog/addbrand-dialog/dialog-animations-example-dialog.component';
import { UpdateDialogComponent } from './components/Material-Components/Dialog/updatebrand-dialog/update-dialog.component';
import { CategoryDialogComponent } from './components/Category/category-dialog/category-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    CategoryEditComponent,
    ProductComponent,
    ProductEditComponent,
    NavbarComponent,
    BrandListComponent,
    CartPageComponent,
    DialogComponent,
    DialogAnimationsExampleDialogComponent,
    UpdateDialogComponent,
    CategoryDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule ,
    FormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
