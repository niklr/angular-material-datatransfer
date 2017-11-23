import { Component, Inject, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatatransferFacade } from '../facades';
import { IDatatransferItem } from '../models/index';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'amd-edit-dialog',
    templateUrl: 'edit-dialog.component.html'
})

export class EditDialogComponent implements AfterViewInit {

    datatransferFacade: DatatransferFacade;
    item: IDatatransferItem;
    itemName: string;
    errorMessage: string;
    editFilenameFormControl: FormControl;

    constructor(
        public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.datatransferFacade = <DatatransferFacade>this.data.datatransferFacade;
        this.item = <IDatatransferItem>this.data.item;
        this.itemName = this.item.name;

        this.editFilenameFormControl = new FormControl('', []);

    }

    ngAfterViewInit() {

    }

    close(): void {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.close();
    }

    editFilename(): void {
        try {
            this.datatransferFacade.editFilename(this.item, this.itemName);
            this.close();
        } catch (error) {
            this.errorMessage = error;
        }
    }
}
