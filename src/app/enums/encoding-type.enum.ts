export enum EncodingType {
    Latin1,
    Hex,
    Base64,
    UTF8
}

export enum EncodingTypeImplementation {
    Internal,
    CryptoBrowserify
}

export namespace EncodingType {
    export function toString(encodingTypeImplementation: EncodingTypeImplementation, encodingType: EncodingType): string {
        switch (encodingType) {
            case EncodingType.Latin1:
                return 'latin1';
            case EncodingType.Hex:
                return 'hex';
            case EncodingType.Base64:
                return 'base64';
            case EncodingType.UTF8:
                return 'utf8';
            default:
                return 'hex';
        }
    }
}
