import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { OutBoundComponent } from './components/out-bound/out-bound.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { adminGuard } from './admin.guard';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product/:id/:id2', component: ProductComponent },
  { path: 'search', component: SearchComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: '**', component: OutBoundComponent },
  {
    path: 'child',
    children: [{ path: 'view', component: ProductViewComponent },
    { path: 'edit', component: ProductEditComponent },
    ]
  },
  { path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
