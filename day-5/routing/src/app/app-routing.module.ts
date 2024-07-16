import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { OutBoundComponent } from './components/out-bound/out-bound.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { adminGuard } from './admin.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home',component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'dashboard', component: DashboardComponent,canActivate: [adminGuard]},
  {path: '**', component: OutBoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
