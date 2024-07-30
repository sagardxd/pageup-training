import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HoverComponent } from "./hover/hover.component";
import { LifecycleExampleComponent } from './lifecycle-example/lifecycle-example.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HoverComponent, LifecycleExampleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-intro';
  count = 0;
  
  decrement() {
    this.count--;
  }  

  increment() {
    this.count++;
  }
} 
