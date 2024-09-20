import {
  Directive,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { LoaderService } from '../../../services/loader.service';

@Directive({
  selector: 'button',
})
export class DisableIfBusyDirective {
  constructor(
    private loadingService: LoaderService,
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.loadingService.isLoading.subscribe((ifTrue: boolean) => {
      if (ifTrue) {
        this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      } else {
        this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      }
    });
  }
}
