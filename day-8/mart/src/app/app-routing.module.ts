import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/Category/category-list/category.component';
import { CategoryEditComponent } from './components/Category/category-edit/category-edit.component';
import { ProductComponent } from './components/Product/product-list/product.component';
import { ProductEditComponent } from './components/Product/product-edit/product-edit.component';
import { BrandListComponent } from './components/Brand/brand-list/brand-list.component';
import { BrandEditComponent } from './components/Brand/brand-edit/brand-edit.component';
import { CartPageComponent } from './components/Cart/cart-page/cart-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'category', pathMatch: 'full' },
  { path: 'category', component: CategoryComponent },
  { path: 'edit/:id', component: CategoryEditComponent },
  { path: 'category/create', component: CategoryEditComponent },
  { path: 'brand', component: BrandListComponent},
  { path: 'brand/create', component: BrandEditComponent},
  { path: 'brandedit/:id', component: BrandEditComponent},
  { path: 'product/create', component: ProductEditComponent },
  { path: 'product', component: ProductComponent },
  { path: 'productedit/:id', component: ProductEditComponent },
  { path: 'cart', component: CartPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
