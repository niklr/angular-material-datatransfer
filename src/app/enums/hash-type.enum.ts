export enum HashType {
    MD5,
    SHA1
}

export enum HashTypeImplementation {
    Internal,
    CryptoBrowserify
}

export namespace HashType {
    export function toString(hashTypeImplementation: HashTypeImplementation, hashType: HashType): string {
        switch (hashType) {
            case HashType.MD5:
                return 'md5';
            case HashType.SHA1:
                return 'sha1';
            default:
                return 'md5';
        }
    }
}
