import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]'
})
export class SoloNumerosDirective {

  // constructor(private el: ElementRef) { }
	// @HostListener('input', ['$event']) onInputChange(event: any) {
	// 	const initalValue = this.el.nativeElement.value;
	// 	this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
	// 	if (initalValue !== this.el.nativeElement.value) {
	// 		event.stopPropagation();
	// 	}
	// }

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
