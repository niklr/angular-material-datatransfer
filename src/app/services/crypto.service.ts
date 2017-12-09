import { Injectable, NgZone } from '@angular/core';

import { FileReaderEvent } from '../extensions';
import { HashType, EncodingType, EncodingTypeImplementation, HashTypeImplementation } from '../enums';
import { IHashContainer, HashContainer, IStreamHashContainer, StreamHashContainer } from '../models';

import '../libraries/crypto-browserify.js';
import { setTimeout } from 'timers';
declare var cryptoBrowserify: any;

@Injectable()
export class CryptoService {

    // hash 4MB at a time
    private readonly STREAM_HASH_CHUNK_SIZE = 1024 * 1000 * 4;
    private readonly HASH_TYPE_IMPLEMENTATION = HashTypeImplementation.CryptoBrowserify;
    private readonly ENCODING_TYPE_IMPLEMENTATION = EncodingTypeImplementation.CryptoBrowserify;

    constructor(private zone: NgZone) {
        // Performance remains unchanged by running the hash function outside of Angular.
        // this.zone.runOutsideAngular(() => { }
    }

    public createHashContainer(file: File, hashType: HashType, encodingType: EncodingType,
        inputEncodingType: EncodingType): IHashContainer {

        let container = new HashContainer(
            file,
            this.HASH_TYPE_IMPLEMENTATION,
            this.ENCODING_TYPE_IMPLEMENTATION,
            hashType,
            encodingType,
            inputEncodingType);

        container.hash = cryptoBrowserify.createHash(container.hashTypeString);

        container.reader.onload = function (event: FileReaderEvent) {
            container.hashString = container.hash.update(event.target.result, container.inputEncodingTypeString)
                .digest(container.encodingTypeString);
            container.endDate = new Date();
            container.percent = 100;
        };

        container.doWork = function () {
            container.reader.readAsBinaryString(container.file);
        };

        return container;
    }

    public createStreamHashContainer(file: File, hashType: HashType, encodingType: EncodingType,
        inputEncodingType: EncodingType, successCallback: Function, errorCallback: Function): IStreamHashContainer {

        let container = new StreamHashContainer(
            file,
            this.HASH_TYPE_IMPLEMENTATION,
            this.ENCODING_TYPE_IMPLEMENTATION,
            hashType,
            encodingType,
            inputEncodingType);

        container.chunkSize = this.STREAM_HASH_CHUNK_SIZE;
        container.offset = 0;
        container.hash = cryptoBrowserify.createHash(container.hashTypeString);

        container.reader.onload = function (event: FileReaderEvent) {
            let binary = event.target.result;

            if (container.offset + container.chunkSize >= container.file.size) {
                container.hash.end(binary, container.inputEncodingTypeString);
            } else {
                container.hash.write(binary, container.inputEncodingTypeString);
            }

            container.offset += container.chunkSize;

            container.doWork();
        };

        container.reader.onerror = function (event) {
            errorCallback(event, container);
        };

        container.doWork = function () {
            if (!container.isCancelled() && !container.isPaused()) {
                if (container.offset > container.file.size) {
                    container.hashString = container.hash.read().toString(container.encodingTypeString);
                    container.endDate = new Date();
                    container.percent = 100;
                    successCallback(container);
                    return;
                }

                let slice = container.file.slice(container.offset, container.offset + container.chunkSize);
                container.reader.readAsBinaryString(slice);
                container.percent = Math.round(container.offset / file.size * 100);
            }
        };

        return container;
    }

}
