import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';

const routes: Routes = [
  {path:'', redirectTo: 'category', pathMatch: 'full'},
  {path:'category',  component: CategoryComponent},
  {path: 'edit/:id', component: CategoryEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
