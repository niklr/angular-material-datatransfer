import { inject, TestBed } from '@angular/core/testing';

import { ProgressInformation } from './progress-information.model';
import { DecimalByteUnit } from '../enums';

describe('ProgressInformation', () => {
    it('should update the bitrate', () => {
        let progressInformation = new ProgressInformation();
        expect(progressInformation.loaded).toBe(0);
        expect(progressInformation.bitrate).toBe(0);
        expect(progressInformation.displayBitrate).toBeUndefined();

        progressInformation.timestamp = 0;
        let interval = 500;
        let now = 2000;
        progressInformation.updateBitrate(now, 1000, interval);
        expect(progressInformation.loaded).toBe(1000);
        expect(progressInformation.bitrate).toBe(4000);
        expect(progressInformation.displayBitrate).toBe('500 Byte/s');
    });
});
