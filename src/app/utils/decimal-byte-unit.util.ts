import { Injectable } from '@angular/core';
import { EnumExtension } from '../extensions/enum.extension';

export enum DecimalByteUnit {
	/**
	 * Byte (B)
	 * 1 Byte
	 */
    Byte,

	/**
	 * Kilobyte (kB)
	 * 10^3 Byte = 1.000 Byte
	 */
    KB,

	/**
	 * Megabyte (MB)
	 * 10^6 Byte = 1.000.000 Byte
	 */
    MB,

	/**
	 * Gigabyte (GB)
	 * 10^9 Byte = 1.000.000.000 Byte
	 */
    GB,

	/**
	 * Terabyte (TB)
	 * 10^12 Byte = 1.000.000.000.000 Byte
	 */
    TB,

	/**
	 * Petabyte (PB)
	 * 10^15 Byte = 1.000.000.000.000.000 Byte
	 */
    PB
}

export interface DecimalByteUnitConvertResult {
    unit: DecimalByteUnit;
    number: number;
}

@Injectable()
export class DecimalByteUnitUtil {
    C_KB: number = Math.pow(10, 3);
    C_MB: number = Math.pow(10, 6);
    C_GB: number = Math.pow(10, 9);
    C_TB: number = Math.pow(10, 12);
    C_PB: number = Math.pow(10, 15);

    MAX: number = Number.MAX_VALUE;

    byteUnits = EnumExtension.getNames(DecimalByteUnit);

    private multiply(number: number, multiplier: number): number {
        let limit: number = this.MAX / multiplier;

        if (number > limit) {
            return Number.MAX_VALUE;
        }
        if (number < -limit) {
            return Number.MIN_VALUE;
        }

        return number * multiplier;
    }

    public convert(number: number, fromUnit: DecimalByteUnit, toUnit: DecimalByteUnit): number {
        let bytes: number = this.toBytes(number, fromUnit);
        switch (toUnit) {
            case DecimalByteUnit.Byte:
                return bytes;
            case DecimalByteUnit.KB:
                return bytes / this.C_KB;
            case DecimalByteUnit.MB:
                return bytes / this.C_MB;
            case DecimalByteUnit.GB:
                return bytes / this.C_GB;
            case DecimalByteUnit.TB:
                return bytes / this.C_TB;
            case DecimalByteUnit.PB:
                return bytes / this.C_PB;
        }
        return number;
    }

    public toBytes(number: number, fromUnit: DecimalByteUnit): number {
        switch (fromUnit) {
            case DecimalByteUnit.Byte:
                return number;
            case DecimalByteUnit.KB:
                return this.multiply(number, this.C_KB);
            case DecimalByteUnit.MB:
                return this.multiply(number, this.C_MB);
            case DecimalByteUnit.GB:
                return this.multiply(number, this.C_GB);
            case DecimalByteUnit.TB:
                return this.multiply(number, this.C_TB);
            case DecimalByteUnit.PB:
                return this.multiply(number, this.C_PB);
        }
        return number;
    }

    public toHumanReadable(number: number, fromUnit: DecimalByteUnit): DecimalByteUnitConvertResult {
        let result: DecimalByteUnitConvertResult = {
            number: number,
            unit: fromUnit
        };
        for (let currentUnit of this.byteUnits) {
            if (Math.abs(result.number) < 1000) {
                result.unit = DecimalByteUnit[currentUnit];
                break;
            } else {
                result.number /= 1000;
            }
        }
        result.number = Number(result.number.toFixed(2));
        return result;
    }
}
