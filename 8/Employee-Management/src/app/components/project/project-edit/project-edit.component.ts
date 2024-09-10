import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  projectByIdData,
  projectByIdResponse,
  projectForm,
  projectPostBody,
  ProjectStatus,
} from '../../../models/project';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeListComponent } from '../../../components/employee/employee-list/employee-list.component';
import { ProjectService } from '../../../services/project.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  public projectEmployees: { id: number; name: string }[] = [];
  private subscriptions: Subscription = new Subscription();
  private paramId: null | string = null;
  public isEdit = false;
  public project: projectByIdData | null = null;
  public isMembersChanged = false;

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.getParamId();
  }

  projectForm = new FormGroup<projectForm>({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    status: new FormControl(null),
    members: new FormArray<FormControl<number | null>>(
      [],
      [Validators.required]
    ),
  });

  private getParamId(): void {
    this.subscriptions.add(
      this.activatedRoute.paramMap.subscribe({
        next: (paramMap) => {
          this.paramId = paramMap.get('id') ?? '';
          if (this.paramId) {
            this.isEdit = true;
            this.getProjectData();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching ParamId',
          });
        },
      })
    );
  }

  private getProjectData(): void {
    this.projectService
      .getProjectById(Number(this.paramId))
      .subscribe((response: projectByIdResponse) => {
        this.project = response.data;
        this.projectForm.patchValue({
          name: response.data.name,
          description: response.data.description,
          status: response.data.status,
        });

        const membersFormArray = this.projectForm.controls.members;
        membersFormArray.clear();

        response.data.members.forEach((member) => {
          membersFormArray.push(new FormControl(member.employeeId));
        });

        this.projectEmployees = response.data.members.map((member) => ({
          id: member.employeeId,
          name: member.employeeName,
        }));
      });
  }

  public addEmployeeDialog() {
    const dialogRef = this.dialog.open(EmployeeListComponent, {
      width: '1000px',
      height: '600px',
      data: this.projectEmployees,
      disableClose: true,
    });

    dialogRef.componentInstance.projectEmployees = this.projectEmployees;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.isAdding = true;
    dialogRef.componentInstance.paginationData.pagedItemsCount = 5;

    this.subscriptions.add(
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
            this.isMembersChanged = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Added',
              // detail: 'Updated Emploue Successfully',
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
      })
    );
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

    this.subscriptions.add(
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
      })
    );
  }

  public removeEmployee(id: number) {
    this.projectEmployees = this.projectEmployees.filter(
      (emp) => emp.id !== id
    );
    if (this.isEdit) {
      const membersFormArray = this.projectForm.controls.members;
      for (let i = 0; i < membersFormArray.length; i++) {
        if (membersFormArray.at(i).value === id) {
          membersFormArray.removeAt(i);
          break;
        }
      }
    }
  }

  public updateProject(): void {
    if (!this.paramId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Project ID is missing',
      });
      return;
    }

    const formattedMembers = this.projectForm.controls.members.value
      .filter((id): id is number => id !== null) // Filter out null values
      .map((id) => ({ employeeId: id }));

    const projectData: projectPostBody = {
      name: this.projectForm.controls.name.value!,
      description: this.projectForm.controls.description.value!,
      status: Number(this.projectForm.controls.status.value!),
      members: formattedMembers,
    };

    this.subscriptions.add(
      this.projectService
        .updateProject(Number(this.paramId), projectData)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Project updated successfully',
            });
            this.router.navigate(['/project']);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error updating project',
            });
          },
        })
    );
  }
}
