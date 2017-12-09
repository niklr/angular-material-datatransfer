import { IPreprocessContainer, PreprocessContainer } from '.';
import { HashType, HashTypeImplementation, EncodingType, EncodingTypeImplementation } from '../enums';

export interface IHashContainer extends IPreprocessContainer {
    file: File;
    hashType: HashType;
    hashTypeString: string;
    encodingType: EncodingType;
    encodingTypeString: string;
    inputEncodingType: EncodingType;
    inputEncodingTypeString: string;
    startDate: Date;
    endDate: Date;
    hash: any;
    hashString: string;
    reader: FileReader;
}

export interface IStreamHashContainer extends IHashContainer {
    chunkSize: number;
    offset: number;
}

export class HashContainer extends PreprocessContainer implements IHashContainer {
    public file: File;
    public hashType: HashType;
    public hashTypeString: string;
    public encodingType: EncodingType;
    public encodingTypeString: string;
    public inputEncodingType: EncodingType;
    public inputEncodingTypeString: string;
    public startDate: Date;
    public endDate: Date;
    public hash: any;
    public hashString: string;
    public reader: FileReader;

    public constructor(file: File, hashTypeImplementation: HashTypeImplementation, encodingTypeImplementation: EncodingTypeImplementation,
        hashType: HashType, encodingType: EncodingType, inputEncodingType: EncodingType) {
        super();
        this.file = file;
        this.hashType = hashType;
        this.hashTypeString = HashType.toString(hashTypeImplementation, hashType);
        this.encodingType = encodingType;
        this.encodingTypeString = EncodingType.toString(encodingTypeImplementation, encodingType);
        this.inputEncodingType = inputEncodingType;
        this.inputEncodingTypeString = EncodingType.toString(encodingTypeImplementation, inputEncodingType);
        this.startDate = new Date();
        this.endDate = new Date();
        this.reader = new FileReader();
    }
}

export class StreamHashContainer extends HashContainer implements IStreamHashContainer {
    public chunkSize: number;
    public offset: number;

    public constructor(file: File, hashTypeImplementation: HashTypeImplementation, encodingTypeImplementation: EncodingTypeImplementation,
        hashType: HashType, encodingType: EncodingType, inputEncodingType: EncodingType) {
        super(file, hashTypeImplementation, encodingTypeImplementation, hashType, encodingType, inputEncodingType);
        this.chunkSize = 0;
        this.offset = 0;
    }

    public cancel(cancel: boolean): void {
        super.cancel(cancel);
        this.offset = 0;
    }
}
