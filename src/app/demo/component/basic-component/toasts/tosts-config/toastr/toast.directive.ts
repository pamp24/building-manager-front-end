import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appToastContainer]',
  exportAs: 'toastContainer'
})
export class ToastContainerDirective {
  constructor(private el: ElementRef) {}
  getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}
