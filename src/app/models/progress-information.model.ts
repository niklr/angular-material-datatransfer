import { ISizeInformation, SizeInformation } from '.';
import { DecimalByteUnit } from '../enums';

export interface IProgressInformation {
    timestamp: number; // milliseconds
    loaded: number; // bytes
    bitrate: number; // bit/s
    displayBitrate: string;
    updateBitrate(now: number, loaded: number, interval: number): void;
}

export class ProgressInformation implements IProgressInformation {

    private sizeInformation: ISizeInformation;

    public timestamp: number;
    public loaded: number;
    public bitrate: number;
    public displayBitrate: string;

    public constructor() {
        this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
        this.loaded = 0;
        this.bitrate = 0;
        this.sizeInformation = new SizeInformation();
    }

    updateBitrate(now: number, loaded: number, interval: number): void {
        let timeDiff = now - this.timestamp;
        if (!this.bitrate || !interval || timeDiff > interval) {
            this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
            this.loaded = loaded;
            this.timestamp = now;
            this.sizeInformation.update({ decimalByteUnit: DecimalByteUnit.Byte, decimalByteUnitSize: this.bitrate / 8 });
            this.displayBitrate = this.sizeInformation.displaySize + ' ' + this.sizeInformation.displayUnit + '/s';
        }
    };
}
