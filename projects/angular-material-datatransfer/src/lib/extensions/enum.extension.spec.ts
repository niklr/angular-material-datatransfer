import { inject, TestBed } from '@angular/core/testing';

import { EnumExtension } from './enum.extension';
import { DecimalByteUnit } from '../enums/decimal-byte-unit.enum';

describe('EnumExtension', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [EnumExtension] });
    });

    it('should get an array containing all enums', inject([EnumExtension], (extension) => {
        expect(EnumExtension.getNames(DecimalByteUnit).length).toBe(6);
    }));

});
