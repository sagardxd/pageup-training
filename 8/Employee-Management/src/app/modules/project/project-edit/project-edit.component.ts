import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  projectForm,
  projectPostBody,
  ProjectStatus,
} from '../../../models/project';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeListComponent } from '../../../modules/employee/employee-list/employee-list.component';
import { ProjectService } from '../../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent {
  public projectEmployees: { id: number; name: string }[] = [];

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private messageService: MessageService
  ) {}

  private _snackBar = inject(MatSnackBar);

  projectForm = new FormGroup<projectForm>({
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    status: new FormControl<ProjectStatus | null>(null),
    members: new FormArray<FormControl<number | null>>(
      [],
      [Validators.required]
    ),
  });

  public addEmployeeDialog() {
    const dialogRef = this.dialog.open(EmployeeListComponent, {
      width: '1000px',
      height: '600px',
      data: this.projectEmployees,
    });

    dialogRef.componentInstance.projectEmployees = this.projectEmployees;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.isAdding = true;
    dialogRef.componentInstance.paginationData.pagedItemsCount = 5;

    dialogRef.afterClosed().subscribe({
      next: (result: { id: number; name: string }[]) => {
        if (result) {
          const membersFormArr = this.projectForm.controls.members;
          const newEmployees = result.filter(
            (emp) => !membersFormArr.value.includes(emp.id)
          );

          // Add new employees to the form array (only id) and projectEmployees (both id and name)
          newEmployees.forEach((emp) => {
            if (emp.id) {
              membersFormArr.push(new FormControl(emp.id));
              if (
                !this.projectEmployees.some(
                  (employee) => employee.id === emp.id
                )
              ) {
                this.projectEmployees.push(emp);
              }
            }
          });

          // Remove employees that are no longer in the projectEmployees
          for (let i = membersFormArr.length - 1; i >= 0; i--) {
            const control = membersFormArr.at(i);
            if (
              control.value &&
              !result.some((emp) => emp.id === control.value)
            ) {
              membersFormArr.removeAt(i);
            }
          }

          // Update the projectEmployees array to reflect the current state
          this.projectEmployees = result;
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Addded Employees Successfully',
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Adding Employees',
        });
      },
    });
  }

  public save() {
    const formattedMembers = this.projectForm.controls.members.value
      .filter((id): id is number => id !== null) // Filter out null values
      .map((id) => ({ employeeId: id }));

    const projectData: projectPostBody = {
      name: this.projectForm.controls.name.value!,
      description: this.projectForm.controls.description.value!,
      status: Number(this.projectForm.controls.status.value!),
      members: formattedMembers,
    };

    this.projectService.postProject(projectData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Project Added Successfully',
        });
        this.projectForm.reset();
        this.projectEmployees = [];
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Saving Project',
        });
      },
    });
  }

  public removeEmployee(id: number) {
    this.projectEmployees = this.projectEmployees.filter(
      (emp) => emp.id !== id
    );
  }
}
