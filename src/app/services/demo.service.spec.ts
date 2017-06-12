import { inject, TestBed } from '@angular/core/testing';

import { DemoService } from './demo.service';

describe('Demo Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [DemoService]});
  });

  it('should ...', inject([DemoService], (demo) => {
    expect(demo.title).toBe('angular-material-datatransfer');
  }));
});
