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

// tslint:disable-next-line: no-namespace
export namespace EncodingTypeExtensions {
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
    export function toEnum(encodingTypeImplementation: EncodingTypeImplementation, encodingType: string): EncodingType {
        switch (encodingType) {
            case 'latin1':
                return EncodingType.Latin1;
            case 'hex':
                return EncodingType.Hex;
            case 'base64':
                return EncodingType.Base64;
            case 'utf8':
                return EncodingType.UTF8;
            default:
                return EncodingType.Hex;
        }
    }
}
