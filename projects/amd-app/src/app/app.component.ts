import { Component, HostListener, ViewChild } from '@angular/core';
import { AngularMaterialDatatransferComponent } from 'projects/amd-lib/src/public-api';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'angular-material-datatransfer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(AngularMaterialDatatransferComponent, {static: false}) amdComponent: AngularMaterialDatatransferComponent;

  constructor() {
  }

  @HostListener('document:github:niklr/angular-material-datatransfer.create', ['$event'])
  public onCreate(event): void {
    this.amdComponent.create(event);
  }

  @HostListener('document:github:niklr/angular-material-datatransfer.update-config', ['$event'])
  public onUpdateConfig(event): void {
    this.amdComponent.setConfig(event);
  }

  @HostListener('document:github:niklr/angular-material-datatransfer.download-item', ['$event'])
  public downloadItem(event): void {
    if (!!event && !!event.detail) {
      const item = event.detail;
      this.amdComponent.datatransferFacade.download(item.filename, item.url, item.size);
    }
  }

}
