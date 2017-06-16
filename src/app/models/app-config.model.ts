export interface IAppConfig {
    uploadTarget: string;
    uploadQuery: any;
    simultaneousUploads: number;
    showUploadDropzone: boolean;
    uploadBrowseElementId: string;
    uploadDropElementId: string;
    paginationRppOptions: number[];
}

export class AppConfig implements IAppConfig {
    uploadTarget = '/';
    uploadQuery = {};
    simultaneousUploads = 2;
    showUploadDropzone = true;
    uploadBrowseElementId = undefined;
    uploadDropElementId = undefined;
    paginationRppOptions = [5, 10, 25];
}
