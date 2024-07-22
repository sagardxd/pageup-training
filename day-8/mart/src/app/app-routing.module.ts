import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { ProductComponent } from './components/product/product.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';

const routes: Routes = [
  {path:'', redirectTo: 'category', pathMatch: 'full'},
  {path:'category',  component: CategoryComponent},
  {path: 'edit/:id', component: CategoryEditComponent},
  {path: 'product/create', component: ProductEditComponent},
  {path:'product',  component: ProductComponent},
  {path: 'productedit/:id', component: ProductEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
