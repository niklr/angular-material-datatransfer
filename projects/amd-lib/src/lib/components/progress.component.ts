import { Component, Input } from '@angular/core';
import { IProgressContainer } from '../models/progress-container.model';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'amd-progress',
    templateUrl: 'progress.component.html'
})

export class ProgressComponent {

    @Input() progressContainer: IProgressContainer;

    constructor() { }
}
