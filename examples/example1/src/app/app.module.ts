import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularMaterialDatatransferModule, AngularMaterialDatatransferComponent } from 'angular-material-datatransfer-lib';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialDatatransferModule
  ],
  providers: [AngularMaterialDatatransferComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
