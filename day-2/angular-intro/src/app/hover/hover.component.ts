import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hover.component.html',
  styleUrl: './hover.component.scss'
})
export class HoverComponent { 
   message:string = '';
   isTrue:boolean = true;

  onHover() {
    this.message = 'Hovered!';
  }

  onClick() {
    this.message = '';
  }
}
