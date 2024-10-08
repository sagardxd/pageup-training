import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from './card/card.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastModule } from 'primeng/toast';
import { DisableIfBusyDirective } from './directives/disable-if-busy.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { FormErrorDirective } from './directives/form-error.directive';
import { PaginatorComponent } from './paginator/paginator.component';

@NgModule({
  declarations: [
    NavbarComponent,
    CardComponent,
    DeleteDialogComponent,
    LoaderComponent,
    DisableIfBusyDirective,
    TruncatePipe,
    FormErrorDirective,
    PaginatorComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
    ToastModule,
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    DeleteDialogComponent,
    LoaderComponent,
    TruncatePipe,
    DisableIfBusyDirective,
    FormErrorDirective,
    PaginatorComponent,
  ],
})
export class SharedModule {}
