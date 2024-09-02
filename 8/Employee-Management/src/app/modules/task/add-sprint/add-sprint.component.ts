import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { sprintByIdResponse, sprintPostBody } from '../../../models/sprint';
import { SprintService } from '../../../services/sprint.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-sprint',
  templateUrl: './add-sprint.component.html',
  styleUrl: './add-sprint.component.scss',
})
export class AddSprintComponent {
  public projectId: string = '';
  public updating = false;
  public sprintId: number | null = null;

  constructor(
    private sprintService: SprintService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) {}

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

    this.sprintService.createSprint(data, 0).subscribe((response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: 'Added Sprint Successfully',
      });
      this.sprintForm.reset();
    });
  }

  public getSprintData(id: number): void {
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
    });

    this.updating = true;
  }

  public updateSprintData() {
    const data: sprintPostBody = {
      name: this.sprintForm.controls.name.value ?? null,
      startDate: this.sprintForm.controls.startDate.value ?? null,
      endDate: this.sprintForm.controls.endDate.value ?? null,
      projectId: Number(this.projectId),
    };
    this.sprintId = 3;

    this.sprintService.createSprint(data, this.sprintId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'info',
          summary: 'updated',
          detail: 'Updated Sprint Successfully',
        });
        this.sprintForm.reset();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating Sprint',
        });
      },
    });
  }
}
