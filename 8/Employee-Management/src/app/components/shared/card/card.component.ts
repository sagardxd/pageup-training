import { Component, Input } from '@angular/core';
import { sprintTasks } from '../../../models/sprint';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() cardDetails!: sprintTasks;
}
