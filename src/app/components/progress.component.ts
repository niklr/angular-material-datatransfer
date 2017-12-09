import { Component, Input } from '@angular/core';
import { IProgressContainer } from '../models';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'amd-progress',
    templateUrl: 'progress.component.html',
    styleUrls: ['progress.component.scss']
})

export class ProgressComponent {

    @Input() progressContainer: IProgressContainer;

    constructor() { }
}
