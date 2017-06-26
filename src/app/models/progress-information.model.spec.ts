import { inject, TestBed } from '@angular/core/testing';

import { ProgressInformation, SizeInformation } from '.';
import { DecimalByteUnit } from '../enums';

describe('ProgressInformation', () => {
    it('should update the bitrate', () => {
        let progressInformation = new ProgressInformation(2000);
        expect(progressInformation.percent).toBe(0);
        expect(progressInformation.bitrate).toBe(0);
        expect(progressInformation.displayBitrate).toBeUndefined();
        expect(progressInformation.totalSizeInformation.displaySize).toBe(2);
        expect(progressInformation.totalSizeInformation.displayUnit).toBe('KB');

        progressInformation.bitrateTimestamp = 0;
        let interval = 500;
        let now = 2000;
        progressInformation.updateBitrate(now, 1000, interval);
        expect(progressInformation.bitrate).toBe(4000);
        expect(progressInformation.displayBitrate).toBe('500 Byte/s');
    });

    it('should update the progress', () => {
        let progressInformation = new ProgressInformation(2000);
        expect(progressInformation.percent).toBe(0);
        expect(progressInformation.bitrate).toBe(0);
        expect(progressInformation.displayBitrate).toBeUndefined();
        expect(progressInformation.loadedSizeInformation.displaySize).toBe(0);
        expect(progressInformation.loadedSizeInformation.displayUnit).toBe('Byte');
        expect(progressInformation.totalSizeInformation.displaySize).toBe(2);
        expect(progressInformation.totalSizeInformation.displayUnit).toBe('KB');

        progressInformation.progressTimestamp = 0;
        let interval = 500;
        let now = 2000;
        progressInformation.updateProgress(now, 1000, interval);
        expect(progressInformation.percent).toBe(50);
        expect(progressInformation.loadedSizeInformation.displaySize).toBe(1);
        expect(progressInformation.loadedSizeInformation.displayUnit).toBe('KB');
    });
});
