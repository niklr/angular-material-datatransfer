import { inject, TestBed } from '@angular/core/testing';
import { ProgressContainer } from './progress-container.model';

describe('ProgressContainer', () => {
    it('should update the bitrate', () => {
        let progressContainer = new ProgressContainer(2000);
        expect(progressContainer.percent).toBe(0);
        expect(progressContainer.bitrate).toBe(0);
        expect(progressContainer.displayBitrate).toBeUndefined();
        expect(progressContainer.totalSizeContainer.displaySize).toBe(2);
        expect(progressContainer.totalSizeContainer.displayUnit).toBe('KB');

        progressContainer.bitrateTimestamp = 0;
        let interval = 500;
        let now = 2000;
        progressContainer.updateBitrate(now, 1000, interval);
        expect(progressContainer.bitrate).toBe(4000);
        expect(progressContainer.displayBitrate).toBe('500 Byte/s');
    });

    it('should update the progress', () => {
        let progressContainer = new ProgressContainer(2000);
        expect(progressContainer.percent).toBe(0);
        expect(progressContainer.bitrate).toBe(0);
        expect(progressContainer.displayBitrate).toBeUndefined();
        expect(progressContainer.loadedSizeContainer.displaySize).toBe(0);
        expect(progressContainer.loadedSizeContainer.displayUnit).toBe('Byte');
        expect(progressContainer.totalSizeContainer.displaySize).toBe(2);
        expect(progressContainer.totalSizeContainer.displayUnit).toBe('KB');

        progressContainer.progressTimestamp = 0;
        let interval = 500;
        let now = 2000;
        progressContainer.updateProgress(now, 1000, interval);
        expect(progressContainer.percent).toBe(50);
        expect(progressContainer.loadedSizeContainer.displaySize).toBe(1);
        expect(progressContainer.loadedSizeContainer.displayUnit).toBe('KB');
    });
});
