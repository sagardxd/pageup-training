import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { MessageService } from 'primeng/api';
import { LoaderService } from './services/loader.service';
import { SharedModule } from './components/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { EmployeeModule } from './components/employee/employee.module';
import { MatIconModule } from '@angular/material/icon';
import { ChartModule } from 'primeng/chart';
import { LayoutComponent } from './components/Layout/layout.component';

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    SharedModule,
    EmployeeModule,
    ToastModule,
    MatIconModule,
    ChartModule,
  ],
  providers: [
    provideAnimationsAsync(),
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
