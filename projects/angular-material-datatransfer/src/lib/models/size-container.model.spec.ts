import { inject, TestBed } from '@angular/core/testing';

import { SizeContainer } from './size-container.model';
import { DecimalByteUnit } from '../enums/decimal-byte-unit.enum';

describe('SizeContainer', () => {
  it('should set and update the display size and display unit', () => {
    let sizeContainer = new SizeContainer({decimalByteUnit: DecimalByteUnit.KB, decimalByteUnitSize: 1000});
    expect(sizeContainer.displaySize).toBe(1);
    expect(sizeContainer.displayUnit).toBe('MB');
    sizeContainer.update({decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 2000});
    expect(sizeContainer.displaySize).toBe(2);
    expect(sizeContainer.displayUnit).toBe('GB');
  });
});
