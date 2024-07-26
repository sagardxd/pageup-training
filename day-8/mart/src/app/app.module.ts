import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './components/Category/category-list/category.component';
import { CategoryEditComponent } from './components/Category/category-edit/category-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './components/Product/product-list/product.component';
import { ProductEditComponent } from './components/Product/product-edit/product-edit.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrandListComponent } from './components/Brand/brand-list/brand-list.component';
import { BrandEditComponent } from './components/Brand/brand-edit/brand-edit.component';
import { CartPageComponent } from './components/Cart/cart-page/cart-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    CategoryEditComponent,
    ProductComponent,
    ProductEditComponent,
    NavbarComponent,
    BrandListComponent,
    BrandEditComponent,
    CartPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
