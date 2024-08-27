import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../modules/shared/delete-dialog/delete-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DeletedialogService {
  constructor(private dialog: MatDialog) {}

  public openDialog() {
    return this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: this.dialog,
    });
  }
}
