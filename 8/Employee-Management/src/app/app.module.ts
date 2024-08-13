import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './components/Employee/employee-list/employee-list.component';
import { DepartmentListComponent } from './components/Department/department-list/department-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DialogComponent } from './components/Department/deparment-dialog/dialog/dialog.component';
import { EmployeeEditComponent } from './components/Employee/employee-edit/employee-edit.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ProjectListComponent } from './components/Projects/project-list/project-list.component';
import { DeleteDialogComponent } from './components/ReusableComps/delete-dialog/delete-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { ProjectEditComponent } from './components/Projects/project-edit/project-edit.component';
import { ProjectViewComponent } from './components/Projects/project-view/project-view.component';
import { EmployeeViewComponent } from './components/Employee/employee-view/employee-view.component';
import { TaskListComponent } from './components/Task/task-list/task-list.component';
import { TaskEditComponent } from './components/Task/task-edit/task-edit.component';
import { TaskViewComponent } from './components/Task/task-view/task-view.component';
import { NavbarComponent } from './components/Navbar/navbar/navbar.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { TaskStoryComponent } from './components/Task/task-story/task-story.component';
@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    DepartmentListComponent,
    DialogComponent,
    EmployeeEditComponent,
    ProjectListComponent,
    DeleteDialogComponent,
    ProjectEditComponent,
    ProjectViewComponent,
    EmployeeViewComponent,
    TaskListComponent,
    TaskEditComponent,
    TaskViewComponent,
    NavbarComponent,
    LoginComponent,
    TaskStoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
