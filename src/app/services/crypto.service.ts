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

    }

    private createHashContainer(file: any, hashType: HashType, encodingType: EncodingType,
        inputEncodingType: EncodingType): IHashContainer {

        let container = new HashContainer(
            this.HASH_TYPE_IMPLEMENTATION,
            this.ENCODING_TYPE_IMPLEMENTATION,
            hashType,
            encodingType,
            inputEncodingType);

        let hash = cryptoBrowserify.createHash(container.hashTypeString);

        let reader = new FileReader();
        reader.onload = function (event: FileReaderEvent) {
            container.hash = hash.update(event.target.result, container.inputEncodingTypeString)
                .digest(container.encodingTypeString);
            container.endDate = new Date();
        };
        reader.readAsBinaryString(file);

        return container;
    }

    private createStreamHashContainer(file: any, hashType: HashType, encodingType: EncodingType,
        inputEncodingType: EncodingType, successCallback: Function, errorCallback: Function): void {

            let container = new StreamHashContainer(
                this.HASH_TYPE_IMPLEMENTATION,
                this.ENCODING_TYPE_IMPLEMENTATION,
                hashType,
                encodingType,
                inputEncodingType);

        container.chunkSize = this.STREAM_HASH_CHUNK_SIZE;
        container.offset = 0;

        let reader = new FileReader();
        let hash = cryptoBrowserify.createHash(container.hashTypeString);

        reader.onload = function (event: FileReaderEvent) {
            // console.log('onload offset: ' + offset + ' file.size: ' + file.size + ' isInAngularZone: ' + NgZone.isInAngularZone());
            let binary = event.target.result;

            if (container.offset + container.chunkSize >= file.size) {
                hash.end(binary, container.inputEncodingTypeString);
            } else {
                hash.write(binary, container.inputEncodingTypeString);
            }

            container.offset += container.chunkSize;

            seek();
        };
        reader.onerror = function (event) {
            errorCallback(event);
        };
        seek();

        function seek() {
            // console.log('seek offset: ' + offset + ' file.size: ' + file.size + ' isInAngularZone: ' + NgZone.isInAngularZone());
            if (container.offset > file.size) {
                // file.progress = 1;
                container.hash = hash.read().toString(container.encodingTypeString);
                container.endDate = new Date();
                let seconds = (container.endDate.getTime() - container.startDate.getTime()) / 1000;
                console.log(seconds);
                successCallback(container.hash);
                return;
            }

            let slice = file.slice(container.offset, container.offset + container.chunkSize);
            reader.readAsBinaryString(slice);
            // file.progress = offset / file.size;
        }
    }

    public createHash(file: any, hashType: HashType, encodingType: EncodingType,
        inputEncodingType: EncodingType, successCallback: Function, errorCallback: Function): void {
        this.zone.runOutsideAngular(() => {
            this.createStreamHashContainer(file, hashType, encodingType, inputEncodingType, successCallback, errorCallback);
        });
    }

}
