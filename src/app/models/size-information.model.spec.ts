import { inject, TestBed } from '@angular/core/testing';

import { SizeInformation } from './size-information.model';
import { DecimalByteUnit } from '../enums';

describe('SizeInformation', () => {
  it('should set and update the display size and display unit', () => {
    let sizeInformation = new SizeInformation({decimalByteUnit: DecimalByteUnit.KB, decimalByteUnitSize: 1000});
    expect(sizeInformation.displaySize).toBe(1);
    expect(sizeInformation.displayUnit).toBe('MB');
    sizeInformation.update({decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 2000});
    expect(sizeInformation.displaySize).toBe(2);
    expect(sizeInformation.displayUnit).toBe('GB');
  });
});
