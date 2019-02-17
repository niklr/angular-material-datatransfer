export enum CustomEventType {
    UNKNOWN,
    CREATE,
    INIT,
    UPLOAD_COMPLETED,
    DOWNLOAD_COMPLETED,
    DOWNLOAD_ITEM,
    UPDATE_CONFIG
}

export namespace CustomEventType {
    let CUSTOM_EVENT_TYPE_NS = 'github:niklr/angular-material-datatransfer.';
    let CUSTOM_EVENT_TYPE_UNKNOWN = CUSTOM_EVENT_TYPE_NS + 'unknown';
    let CUSTOM_EVENT_TYPE_CREATE = CUSTOM_EVENT_TYPE_NS + 'create';
    let CUSTOM_EVENT_TYPE_INIT = CUSTOM_EVENT_TYPE_NS + 'init';
    let CUSTOM_EVENT_TYPE_UPLOAD_COMPLETED = CUSTOM_EVENT_TYPE_NS + 'upload-completed';
    let CUSTOM_EVENT_TYPE_DOWNLOAD_COMPLETED = CUSTOM_EVENT_TYPE_NS + 'download-completed';
    let CUSTOM_EVENT_TYPE_DOWNLOAD_ITEM = CUSTOM_EVENT_TYPE_NS + 'download-item';
    let CUSTOM_EVENT_TYPE_UPDATE_CONFIG = CUSTOM_EVENT_TYPE_NS + 'update-config';
    export function toString(type: CustomEventType): string {
        switch (type) {
            case CustomEventType.CREATE:
                return CUSTOM_EVENT_TYPE_CREATE;
            case CustomEventType.INIT:
                return CUSTOM_EVENT_TYPE_INIT;
            case CustomEventType.UPLOAD_COMPLETED:
                return CUSTOM_EVENT_TYPE_UPLOAD_COMPLETED;
            case CustomEventType.DOWNLOAD_COMPLETED:
                return CUSTOM_EVENT_TYPE_DOWNLOAD_COMPLETED;
            case CustomEventType.DOWNLOAD_ITEM:
                return CUSTOM_EVENT_TYPE_DOWNLOAD_ITEM;
            case CustomEventType.UPDATE_CONFIG:
                return CUSTOM_EVENT_TYPE_UPDATE_CONFIG;
            default:
                return CUSTOM_EVENT_TYPE_UNKNOWN;
        }
    }
    export function toEnum(type: string): CustomEventType {
        switch (type) {
            case CUSTOM_EVENT_TYPE_CREATE:
                return CustomEventType.CREATE;
            case CUSTOM_EVENT_TYPE_INIT:
                return CustomEventType.INIT;
            case CUSTOM_EVENT_TYPE_UPLOAD_COMPLETED:
                return CustomEventType.UPLOAD_COMPLETED;
            case CUSTOM_EVENT_TYPE_DOWNLOAD_COMPLETED:
                return CustomEventType.DOWNLOAD_COMPLETED;
            case CUSTOM_EVENT_TYPE_DOWNLOAD_ITEM:
                return CustomEventType.DOWNLOAD_ITEM;
            case CUSTOM_EVENT_TYPE_UPDATE_CONFIG:
                return CustomEventType.UPDATE_CONFIG;
            default:
                return CustomEventType.UNKNOWN;
        }
    }
}
