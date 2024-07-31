import { Component } from '@angular/core';
import { DepartmentService } from '../../../../services/department.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  public requesting = true;

  constructor(private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) { }

  public name = new FormControl('', [Validators.required]);

  addDepartment(): void {
    if (this.name.valid) {
      const nameValue = this.name.value;
      if (nameValue) {
        this.requesting = false;
        this.departmentService.createDepartment(nameValue).subscribe((response) => {
          if (response.status === 200) {
            this.requesting = true;
            alert('Department added successfully');
            this.dialogRef.close(true);
          }
        },
          (error: HttpErrorResponse) => {
            console.error('HTTP Error Response:',);
            this.requesting = true;
            if (error.error.status === 409) {
              alert('Department already exists');
            } else {
              alert('Failed to add department');
            }
          });
      }
    }
  }


}
