import { Component, Input } from '@angular/core';
import { IProgressInformation } from '../models';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'amd-progress',
    templateUrl: 'progress.component.html',
    styleUrls: ['progress.component.scss']
})

export class ProgressComponent {

    @Input() progressInformation: IProgressInformation;

    constructor() { }
}
