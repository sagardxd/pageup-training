import { Component, inject } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { RequestHandlerService } from '../../../services/request-handler.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  public requesting = true;
  public dialog: any = null;

  constructor(
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private messageService: MessageService,
    private requestHandler: RequestHandlerService
  ) {}

  public name = new FormControl('', [Validators.required]);

  addDepartment(): void {
    this.requestHandler.startRequest();

    if (this.name.valid) {
      if (this.name.value) {
        this.requesting = false;
        this.departmentService.createDepartment(this.name.value).subscribe(
          (response) => {
            if (response.status === 200) {
              this.requesting = true;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Added Department',
              });
              this.requestHandler.stopRequest();
              this.dialogRef.close(true);
            }
          },
          (error: HttpErrorResponse) => {
            console.error('HTTP Error Response:');
            this.requesting = true;
            if (error.error.status === 409) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Error',
                detail: 'Department already exsists!',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error Adding',
              });
            }
          }
        );
      }
    }
  }

  public closeDialog(): void {
    this.dialog.close();
  }
}
