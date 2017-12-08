import { Injectable, NgZone } from '@angular/core';

import { FileReaderEvent } from '../extensions';
import { HashType, EncodingType, EncodingTypeImplementation, HashTypeImplementation } from '../enums';
import { IHashContainer, HashContainer, IStreamHashContainer, StreamHashContainer } from '../models';

import '../libraries/crypto-browserify.js';
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

    private createHashContainer(file: File, hashType: HashType, encodingType: EncodingType,
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
            container.progress = 1;
        };

        container.run = function () {
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
            // console.log('onload offset: ' + offset + ' file.size: ' + file.size + ' isInAngularZone: ' + NgZone.isInAngularZone());
            let binary = event.target.result;

            if (container.offset + container.chunkSize >= container.file.size) {
                container.hash.end(binary, container.inputEncodingTypeString);
            } else {
                container.hash.write(binary, container.inputEncodingTypeString);
            }

            container.offset += container.chunkSize;

            container.run();
        };

        container.reader.onerror = function (event) {
            errorCallback(event, container);
        };

        container.run = function () {
            // console.log('seek offset: ' + offset + ' file.size: ' + file.size + ' isInAngularZone: ' + NgZone.isInAngularZone());
            if (container.offset > file.size) {
                container.hashString = container.hash.read().toString(container.encodingTypeString);
                container.endDate = new Date();
                container.progress = 1;
                successCallback(container);
                return;
            }

            let slice = file.slice(container.offset, container.offset + container.chunkSize);
            container.reader.readAsBinaryString(slice);
            container.progress = container.offset / file.size;
        };

        return container;
    }

}
