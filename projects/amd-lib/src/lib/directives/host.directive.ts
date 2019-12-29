import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[amd-host]',
})
export class HostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
