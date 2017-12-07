import { Injectable, NgZone } from '@angular/core';

import { FileReaderEvent } from '../extensions';
import { HashType } from '../enums';

// import * as crypto from 'crypto-browserify';
import '../../public/scripts/crypto-browserify.js';
declare var myNodeObjects: any;

@Injectable()
export class CryptoService {

    constructor(private zone: NgZone) {

    }

    private createMemoryHash(file: any, hashType: HashType): void {
        let reader = new FileReader();
        reader.onload = function (event: FileReaderEvent) {
            console.log(myNodeObjects.crypto.createHash('sha1').update(event.target.result, 'latin1').digest('hex'));
        };
        reader.readAsBinaryString(file);
    }

    private createStreamHash(file: any, hashType: HashType, successCallback: Function, errorCallback: Function): void {
        // 10MB at a time
        let CHUNK_SIZE = 1024 * 1000 * 10;
        let offset = 0;
        let reader = new FileReader();
        let startDate = new Date();
        let encoding = 'latin1'; // latin1, hex, base64, utf8
        let stream = myNodeObjects.crypto.createHash('sha1');

        reader.onload = function (event: FileReaderEvent) {
            console.log(stream);
            console.log('onload offset: ' + offset + ' file.size: ' + file.size + ' isInAngularZone: ' + NgZone.isInAngularZone());
            let that = this as CryptoService;
            let binary = event.target.result;

            if (offset + CHUNK_SIZE >= file.size) {
                stream.end(binary, encoding);
                // that.zone.runOutsideAngular(() => { stream.end(binary, encoding); });
            } else {
                stream.write(binary, encoding);
                // that.zone.runOutsideAngular(() => { stream.write(binary, encoding); });
            }

            offset += CHUNK_SIZE;

            seek();
        }.bind(this);
        reader.onerror = function (event) {
            errorCallback(event);
        };
        seek();

        function seek() {
            console.log('seek offset: ' + offset + ' file.size: ' + file.size + ' isInAngularZone: ' + NgZone.isInAngularZone());
            if (offset > file.size) {
                // file.progress = 1;
                let hash = stream.read().toString('hex');
                let endDate = new Date();
                let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                console.log(seconds);
                successCallback(hash);
                return;
            }

            let slice = file.slice(offset, offset + CHUNK_SIZE);
            reader.readAsBinaryString(slice);
            // file.progress = offset / file.size;
        }
    }

    public createHash(file: any, hashType: HashType, successCallback: Function, errorCallback: Function): void {
        this.zone.runOutsideAngular(() => {
            this.createStreamHash(file, hashType, successCallback, errorCallback);
            // window['preprocessFile'](file, successCallback, errorCallback);
        });
    }

}
