import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { sprintByIdResponse, sprintPostBody } from '../../../models/sprint';
import { SprintService } from '../../../services/sprint.service';
import { MessageService } from 'primeng/api';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-sprint',
  templateUrl: './add-sprint.component.html',
  styleUrl: './add-sprint.component.scss',
})
export class AddSprintComponent implements OnDestroy {
  public projectId: string = '';
  public updating = false;
  public sprintId: number = 0;
  public dialogRef!: MatDialogRef<AddSprintComponent>;
  public isEdit: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private sprintService: SprintService,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public sprintForm = new FormGroup({
    name: new FormControl<string | null>('', [Validators.required]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null, [Validators.required]),
  });

  public addSprint() {
    const data: sprintPostBody = {
      name: this.sprintForm.controls.name.value ?? null,
      startDate: this.sprintForm.controls.startDate.value ?? null,
      endDate: this.sprintForm.controls.endDate.value ?? null,
      projectId: Number(this.projectId),
    };

    this.subscriptions.add(
      this.sprintService.createSprint(data, 0).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Added Sprint Successfully',
          });
          this.sprintForm.reset();
          this.dialogRef.close();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error adding sprint',
          });
        },
      })
    );
  }

  public getSprintData(id: number): void {
    this.subscriptions.add(
      this.sprintService.getSprintById(id).subscribe({
        next: (res: sprintByIdResponse) => {
          this.sprintForm.setValue({
            name: res.data.name,
            startDate: res.data.startDate,
            endDate: res.data.endDate,
          });
          this.sprintId = res.data.id;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching sprint',
          });
        },
      })
    );
  }

  public updateSprintData() {
    const data: sprintPostBody = {
      name: this.sprintForm.controls.name.value ?? null,
      startDate: this.sprintForm.controls.startDate.value ?? null,
      endDate: this.sprintForm.controls.endDate.value ?? null,
      projectId: Number(this.projectId),
    };

    this.subscriptions.add(
      this.sprintService.createSprint(data, this.sprintId).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'info',
            summary: 'updated',
            detail: 'Updated Sprint Successfully',
          });
          this.sprintForm.reset();
          this.dialogRef.close();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating Sprint',
          });
        },
      })
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public resetDate(): void {
    this.sprintForm.controls.startDate.setValue(null);
    this.sprintForm.controls.endDate.setValue(null);
  }
}
