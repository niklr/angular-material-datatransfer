import { ReflectiveInjector } from '@angular/core';
import { ISizeInformation, SizeInformation } from '.';
import { DecimalByteUnit } from '../enums';
import { DateUtil } from '../utils';

export interface IProgressInformation {
    total: number; // bytes
    progressTimestamp: number; // milliseconds
    bitrateTimestamp: number; // milliseconds
    bitrate: number; // bit/s
    percent: number; // 0-100
    displayBitrate: string;
    reset(total: number): void;
    updateProgress(now: number, loaded: number, interval: number): void;
    updateBitrate(now: number, loaded: number, interval: number): void;
}

export class ProgressInformation implements IProgressInformation {
    private dateUtil: DateUtil;
    private loaded: number; // bytes
    private bitrateSizeInformation: ISizeInformation;

    public total: number;
    public progressTimestamp: number;
    public bitrateTimestamp: number;
    public bitrate: number;
    public percent: number;
    public displayBitrate: string;
    public loadedSizeInformation: ISizeInformation;
    public totalSizeInformation: ISizeInformation;

    public constructor(total: number) {
        let injector = ReflectiveInjector.resolveAndCreate([DateUtil]);
        this.dateUtil = injector.get(DateUtil);

        this.bitrateSizeInformation = new SizeInformation();
        this.loadedSizeInformation = new SizeInformation();
        this.totalSizeInformation = new SizeInformation();
        this.reset(total);
    }

    public reset(total: number): void {
        this.progressTimestamp = this.dateUtil.now();
        this.bitrateTimestamp = this.dateUtil.now();
        this.loaded = 0;
        this.bitrate = 0;
        this.percent = 0;
        this.total = total;
        this.displayBitrate = undefined;
        this.bitrateSizeInformation.updateDecimal(DecimalByteUnit.Byte, this.bitrate);
        this.loadedSizeInformation.updateDecimal(DecimalByteUnit.Byte, this.loaded);
        this.totalSizeInformation.updateDecimal(DecimalByteUnit.Byte, this.total);
    }

    public updateProgress(now: number, loaded: number, interval: number): void {
        let timeDiff = now - this.progressTimestamp;
        if (!this.percent || timeDiff > interval || loaded >= this.total) {
            this.percent = Number((loaded / this.total * 100).toFixed(2));
            this.loaded = loaded;
            this.loadedSizeInformation.updateDecimal(DecimalByteUnit.Byte, this.loaded);
            this.progressTimestamp = now;
        }
    }

    public updateBitrate(now: number, loaded: number, interval: number): void {
        let timeDiff = now - this.bitrateTimestamp;
        if (!this.bitrate || timeDiff > interval) {
            this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
            this.bitrateSizeInformation.updateDecimal(DecimalByteUnit.Byte, this.bitrate / 8);
            this.displayBitrate = this.bitrateSizeInformation.displaySize + ' ' + this.bitrateSizeInformation.displayUnit + '/s';
            this.bitrateTimestamp = now;
        }
    };
}
