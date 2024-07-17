import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class ChildComponent {
 @Input() item :string = ''; 

 @Output() newItemEvent = new EventEmitter<string>();


 addNewItem(value: string) {
   this.newItemEvent.emit(value);
}

}
