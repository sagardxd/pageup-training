import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { projectForm, ProjectStatus } from '../../../models/project';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeListComponent } from '../../Employee/employee-list/employee-list.component';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss'
})
export class ProjectEditComponent {

  constructor(private dialog: MatDialog) { }

  projectForm = new FormGroup<projectForm>({
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    status: new FormControl<ProjectStatus | null>(null),
    members: new FormArray<FormControl<number>>([])
  })

  public addEmployeeDialog() {
    // open dialog
    this.dialog.open(EmployeeListComponent, {
      width: '1000px',
      height: '600px'
    })

  }



}
