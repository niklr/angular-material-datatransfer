import { inject, TestBed } from '@angular/core/testing';

import { DecimalByteUnit } from '../enums';
import { DecimalByteUnitUtil } from './decimal-byte-unit.util';

describe('DecimalByteUnit Util', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [DecimalByteUnitUtil] });
    });

    it('should convert Byte to Byte', inject([DecimalByteUnitUtil], (util) => {
        expect(util.convert(1, DecimalByteUnit.Byte, DecimalByteUnit.Byte)).toBe(1);
    }));

    it('should convert Byte to KB', inject([DecimalByteUnitUtil], (util) => {
        expect(util.convert(1000, DecimalByteUnit.Byte, DecimalByteUnit.KB)).toBe(1);
    }));

    it('should convert KB to Byte', inject([DecimalByteUnitUtil], (util) => {
        expect(util.convert(1, DecimalByteUnit.KB, DecimalByteUnit.Byte)).toBe(1000);
    }));

    it('should convert Byte to human readable', inject([DecimalByteUnitUtil], (util) => {
        let result: [DecimalByteUnit, number] = util.format(10146666, DecimalByteUnit.Byte);
        expect(result[0]).toBe(DecimalByteUnit.MB);
        expect(result[1]).toBe(10.15);
    }));

    it('should convert MB to human readable', inject([DecimalByteUnitUtil], (util) => {
        let result: [DecimalByteUnit, number] = util.format(10146, DecimalByteUnit.MB);
        expect(result[0]).toBe(DecimalByteUnit.GB);
        expect(result[1]).toBe(10.15);
    }));
});
