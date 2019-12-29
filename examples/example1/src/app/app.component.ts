import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AngularMaterialDatatransferComponent } from 'angular-material-datatransfer-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(AngularMaterialDatatransferComponent, {static: false}) amdComponent: AngularMaterialDatatransferComponent;

  constructor() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const config = {
        core: {
          showUploadDropzone: true,
          paginationRppOptions: [5, 10, 25],
          preprocessHashEnabled: true,
          preprocessHashChecked: false
        },
        resumablejs: {
          simultaneousUploads: 2,
          preprocess: function (chunk) {
            // do something with the chunk
            chunk.preprocessFinished();
          }
        }
      };
      this.amdComponent.create(config);
    }, 10);
  }

}
