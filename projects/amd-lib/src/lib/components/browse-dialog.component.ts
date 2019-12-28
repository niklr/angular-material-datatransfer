import { Component, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatatransferFacade } from '../facades/datatransfer.facade';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'amd-browse-dialog',
    templateUrl: 'browse-dialog.component.html'
})

export class BrowseDialogComponent implements AfterViewInit {

    datatransferFacade: DatatransferFacade;

    constructor(
        public dialogRef: MatDialogRef<BrowseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.datatransferFacade = <DatatransferFacade>this.data.datatransferFacade;
    }

    ngAfterViewInit() {
        this.datatransferFacade.assignUploadBrowse(document.getElementById('amd-browse-files'));
        this.datatransferFacade.assignUploadBrowse(document.getElementById('amd-browse-folder'), true);
    }

    close(): void {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.close();
    }
}
