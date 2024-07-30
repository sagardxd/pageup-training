import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, DoCheck,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
selector: 'app-lifecycle-example',
standalone: true,
templateUrl: './lifecycle-example.component.html',
styleUrls: ['./lifecycle-example.component.scss']
})
export class LifecycleExampleComponent implements OnInit, OnDestroy, OnChanges,
                                          DoCheck, AfterContentInit,
                                          AfterContentChecked, AfterViewInit,
                                          AfterViewChecked {

constructor() {
console.log('Constructor executed');
}

ngOnInit(): void {
console.log('ngOnInit executed');
}

ngOnChanges(changes: SimpleChanges): void {
console.log('ngOnChanges executed', changes);
}

ngDoCheck(): void {
console.log('ngDoCheck executed');
}

ngAfterContentInit(): void {
console.log('ngAfterContentInit executed');
}

ngAfterContentChecked(): void {
console.log('ngAfterContentChecked executed');
}

ngAfterViewInit(): void {
console.log('ngAfterViewInit executed');
}

ngAfterViewChecked(): void {
console.log('ngAfterViewChecked executed');
}

ngOnDestroy(): void {
console.log('ngOnDestroy executed');
}
}
