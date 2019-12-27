import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMaterialDatatransferComponent } from './angular-material-datatransfer.component';

describe('AngularMaterialDatatransferComponent', () => {
  let component: AngularMaterialDatatransferComponent;
  let fixture: ComponentFixture<AngularMaterialDatatransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularMaterialDatatransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularMaterialDatatransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
