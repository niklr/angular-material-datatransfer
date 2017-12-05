import { Injectable } from '@angular/core';

import { FileReaderEvent } from '../extensions';
import { HashType } from '../enums';

import * as crypto from 'crypto-browserify';

@Injectable()
export class CryptoService {

    constructor() {

    }

    public createHash(file: any, hashType: HashType): void {
        let reader = new FileReader();
        reader.onload = function (event: FileReaderEvent) {
            console.log(crypto.createHash('sha1').update(event.target.result, 'latin1').digest('hex'));
        };
        reader.readAsBinaryString(file);
    }

}
