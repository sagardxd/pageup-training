import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFormError]',
})
export class FormErrorDirective implements OnInit, OnDestroy {
  @Input('appFormError') control!: FormControl;

  private errorDiv: HTMLDivElement | null = null;
  private statusChangesSubscription: Subscription | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Create a div for displaying error messages
    this.errorDiv = this.renderer.createElement('div');
    this.renderer.addClass(this.errorDiv, 'error-message');
    this.renderer.setStyle(this.errorDiv, 'color', 'red');
    this.renderer.setStyle(this.errorDiv, 'font-size', '12px');
    this.renderer.setStyle(this.errorDiv, 'margin-top', '4px');
    this.renderer.setStyle(this.errorDiv, 'display', 'none'); // Hide by default
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      this.errorDiv
    );

    // Subscribe to the control's status changes
    this.statusChangesSubscription = this.control.statusChanges.subscribe(
      () => {
        this.applyHighlight();
        this.displayErrorMessages();
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up subscription when directive is destroyed
    if (this.statusChangesSubscription) {
      this.statusChangesSubscription.unsubscribe();
    }
  }

  private applyHighlight(): void {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid red');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border', 'none');
    }
  }

  private displayErrorMessages(): void {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      const errors = this.control.errors;
      const errorMessage = this.getErrorMessage(errors);
      this.renderer.setProperty(this.errorDiv, 'textContent', errorMessage);
      this.renderer.setStyle(
        this.errorDiv,
        'display',
        errorMessage ? 'block' : 'none'
      ); // Show error message if exists
    } else {
      this.renderer.setStyle(this.errorDiv, 'display', 'none'); // Hide error message
    }
  }

  private getErrorMessage(errors: any): string {
    if (!errors) {
      return '';
    }

    if (errors.required) {
      return 'This field is required.';
    } else if (errors.minlength) {
      return `Minimum length is ${errors.minlength.requiredLength}.`;
    } else if (errors.maxlength) {
      return `Maximum length is ${errors.maxlength.requiredLength}.`;
    } else if (errors.email) {
      return 'Invalid email address.';
    } else if (errors.pattern) {
      return 'Invalid format.';
    } else if (errors.customError) {
      return errors.customError; // Handle custom errors
    }

    return 'Invalid input.';
  }
}
