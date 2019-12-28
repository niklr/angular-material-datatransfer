export enum CustomEventType {
    UNKNOWN,
    // This event can be used to bootstrap the app module. An IAppConfig can be passed as detail payload.
    CREATE,
    // This event can be used to trigger an item download. The filename, url and size can be passed as detail payload.
    DOWNLOAD_ITEM,
    // This event can be used to update the app configuration. An IAppConfig can be passed as detail payload.
    UPDATE_CONFIG,
    // Indicates that the app has been initialized.
    INIT,
    // Indicates that the overall upload has been completed.
    UPLOAD_COMPLETED,
    // Indicates that the overall download has been completed.
    DOWNLOAD_COMPLETED,
    // Indicates that an item has been added. It will be passed a IDatatransferItem as detail payload.
    ITEM_ADDED,
    // Indicates that an item has been removed. It will be passed a IDatatransferItem as detail payload.
    ITEM_REMOVED,
    // Indicates that an item has been completed.
    ITEM_COMPLETED,
    // Indicates that all items have been cleared.
    ITEMS_CLEARED
}

// tslint:disable-next-line: no-namespace
export namespace CustomEventTypeExtensions {
    const CUSTOM_EVENT_TYPE_NS = 'github:niklr/angular-material-datatransfer.';
    const CUSTOM_EVENT_TYPE_UNKNOWN = CUSTOM_EVENT_TYPE_NS + 'unknown';
    const CUSTOM_EVENT_TYPE_CREATE = CUSTOM_EVENT_TYPE_NS + 'create';
    const CUSTOM_EVENT_TYPE_DOWNLOAD_ITEM = CUSTOM_EVENT_TYPE_NS + 'download-item';
    const CUSTOM_EVENT_TYPE_UPDATE_CONFIG = CUSTOM_EVENT_TYPE_NS + 'update-config';
    const CUSTOM_EVENT_TYPE_INIT = CUSTOM_EVENT_TYPE_NS + 'init';
    const CUSTOM_EVENT_TYPE_UPLOAD_COMPLETED = CUSTOM_EVENT_TYPE_NS + 'upload-completed';
    const CUSTOM_EVENT_TYPE_DOWNLOAD_COMPLETED = CUSTOM_EVENT_TYPE_NS + 'download-completed';
    const CUSTOM_EVENT_TYPE_ITEM_ADDED = CUSTOM_EVENT_TYPE_NS + 'item-added';
    const CUSTOM_EVENT_TYPE_ITEM_REMOVED = CUSTOM_EVENT_TYPE_NS + 'item-removed';
    const CUSTOM_EVENT_TYPE_ITEM_COMPLETED = CUSTOM_EVENT_TYPE_NS + 'item-completed';
    const CUSTOM_EVENT_TYPE_ITEMS_CLEARED = CUSTOM_EVENT_TYPE_NS + 'items-cleared';
    export function toString(type: CustomEventType): string {
        switch (type) {
            case CustomEventType.CREATE:
                return CUSTOM_EVENT_TYPE_CREATE;
            case CustomEventType.DOWNLOAD_ITEM:
                return CUSTOM_EVENT_TYPE_DOWNLOAD_ITEM;
            case CustomEventType.UPDATE_CONFIG:
                return CUSTOM_EVENT_TYPE_UPDATE_CONFIG;
            case CustomEventType.INIT:
                return CUSTOM_EVENT_TYPE_INIT;
            case CustomEventType.UPLOAD_COMPLETED:
                return CUSTOM_EVENT_TYPE_UPLOAD_COMPLETED;
            case CustomEventType.DOWNLOAD_COMPLETED:
                return CUSTOM_EVENT_TYPE_DOWNLOAD_COMPLETED;
            case CustomEventType.ITEM_ADDED:
                return CUSTOM_EVENT_TYPE_ITEM_ADDED;
            case CustomEventType.ITEM_REMOVED:
                return CUSTOM_EVENT_TYPE_ITEM_REMOVED;
            case CustomEventType.ITEM_COMPLETED:
                return CUSTOM_EVENT_TYPE_ITEM_COMPLETED;
            case CustomEventType.ITEMS_CLEARED:
                return CUSTOM_EVENT_TYPE_ITEMS_CLEARED;
            default:
                return CUSTOM_EVENT_TYPE_UNKNOWN;
        }
    }
    export function toEnum(type: string): CustomEventType {
        switch (type) {
            case CUSTOM_EVENT_TYPE_CREATE:
                return CustomEventType.CREATE;
            case CUSTOM_EVENT_TYPE_DOWNLOAD_ITEM:
                return CustomEventType.DOWNLOAD_ITEM;
            case CUSTOM_EVENT_TYPE_UPDATE_CONFIG:
                return CustomEventType.UPDATE_CONFIG;
            case CUSTOM_EVENT_TYPE_INIT:
                return CustomEventType.INIT;
            case CUSTOM_EVENT_TYPE_UPLOAD_COMPLETED:
                return CustomEventType.UPLOAD_COMPLETED;
            case CUSTOM_EVENT_TYPE_DOWNLOAD_COMPLETED:
                return CustomEventType.DOWNLOAD_COMPLETED;
            case CUSTOM_EVENT_TYPE_ITEM_ADDED:
                return CustomEventType.ITEM_ADDED;
            case CUSTOM_EVENT_TYPE_ITEM_REMOVED:
                return CustomEventType.ITEM_REMOVED;
            case CUSTOM_EVENT_TYPE_ITEM_COMPLETED:
                return CustomEventType.ITEM_COMPLETED;
            case CUSTOM_EVENT_TYPE_ITEMS_CLEARED:
                return CustomEventType.ITEMS_CLEARED;
            default:
                return CustomEventType.UNKNOWN;
        }
    }
}
