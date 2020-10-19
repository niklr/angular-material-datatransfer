import { Component, Inject, AfterViewInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DatatransferFacade } from "../facades/datatransfer.facade";
import { IDatatransferItem } from "../models/datatransfer-item.model";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "amd-edit-dialog",
  templateUrl: "edit-dialog.component.html",
})
export class EditDialogComponent implements AfterViewInit {
  datatransferFacade: DatatransferFacade;
  mode: string;
  item: IDatatransferItem;
  itemPath: string;
  itemName: string;
  errorMessage: string;
  editFormControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.datatransferFacade = <DatatransferFacade>this.data.datatransferFacade;
    this.mode = this.data.mode;
    this.item = <IDatatransferItem>this.data.item;
    this.itemPath = this.item.path;
    this.itemName = this.item.name;

    this.editFormControl = new FormControl("", []);
  }

  ngAfterViewInit() {}

  close(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.close();
  }

  editPath(): void {
    try {
      this.datatransferFacade.editPath(
        this.item,
        this.item.path,
        this.itemPath
      );
      this.close();
    } catch (error) {
      this.errorMessage = error;
    }
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
