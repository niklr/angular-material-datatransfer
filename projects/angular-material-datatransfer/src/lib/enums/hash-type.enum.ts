export enum HashType {
    MD5,
    SHA1
}

export enum HashTypeImplementation {
    Internal,
    CryptoBrowserify
}

// tslint:disable-next-line: no-namespace
export namespace HashTypeExtensions {
    export function toString(hashTypeImplementation: HashTypeImplementation, hashType: HashType): string {
        switch (hashType) {
            case HashType.MD5:
                return 'md5';
            case HashType.SHA1:
                return 'sha1';
            default:
                return 'sha1';
        }
    }
    export function toEnum(hashTypeImplementation: HashTypeImplementation, hashType: string): HashType {
        switch (hashType) {
            case 'md5':
                return HashType.MD5;
            case 'sha1':
                return HashType.SHA1;
            default:
                return HashType.SHA1;
        }
    }
}
