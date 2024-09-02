import { Directive, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Directive({
  selector: '[appDisableButtonsOnLoad]',
})
export class DisableButtonsOnLoadDirective implements OnInit, OnDestroy {
  private subscription!: Subscription;
  constructor(
    private renderer: Renderer2,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.subscription = this.loaderService.areButtonDisabled.subscribe(
      (disabled) => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
          if (disabled) {
            this.renderer.setAttribute(button, 'disabled', 'true');
            this.renderer.addClass(button, 'disabled');
          } else {
            this.renderer.removeAttribute(button, 'disabled');
            this.renderer.removeClass(button, 'disabled');
          }
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
