import { HashType, HashTypeImplementation, EncodingType, EncodingTypeImplementation } from '../enums';

export interface IHashContainer {
    hashType: HashType;
    hashTypeString: string;
    encodingType: EncodingType;
    encodingTypeString: string;
    inputEncodingType: EncodingType;
    inputEncodingTypeString: string;
    startDate: Date;
    endDate: Date;
    hash: string;
}

export interface IStreamHashContainer extends IHashContainer {
    chunkSize: number;
    offset: number;
}

export class HashContainer implements IHashContainer {
    public hashType: HashType;
    public hashTypeString: string;
    public encodingType: EncodingType;
    public encodingTypeString: string;
    public inputEncodingType: EncodingType;
    public inputEncodingTypeString: string;
    public startDate: Date;
    public endDate: Date;
    public hash: string;

    public constructor(hashTypeImplementation: HashTypeImplementation, encodingTypeImplementation: EncodingTypeImplementation,
        hashType: HashType, encodingType: EncodingType, inputEncodingType: EncodingType) {
        this.hashType = hashType;
        this.hashTypeString = HashType.toString(hashTypeImplementation, hashType);
        this.encodingType = encodingType;
        this.encodingTypeString = EncodingType.toString(encodingTypeImplementation, encodingType);
        this.inputEncodingType = inputEncodingType;
        this.inputEncodingTypeString = EncodingType.toString(encodingTypeImplementation, inputEncodingType);
        this.startDate = new Date();
        this.endDate = new Date();
    }
}

export class StreamHashContainer extends HashContainer implements IStreamHashContainer {
    public chunkSize: number;
    public offset: number;

    public constructor(hashTypeImplementation: HashTypeImplementation, encodingTypeImplementation: EncodingTypeImplementation,
        hashType: HashType, encodingType: EncodingType, inputEncodingType: EncodingType) {
        super(hashTypeImplementation, encodingTypeImplementation, hashType, encodingType, inputEncodingType);
    }
}
