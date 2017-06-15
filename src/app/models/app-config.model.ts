export interface IAppConfig {
    showUploadDropzone: boolean;
    paginationRppOptions: number[];
    simultaneousUploads: number;
}

export class AppConfig implements IAppConfig {
    showUploadDropzone = true;
    paginationRppOptions = [5, 10, 25];
    simultaneousUploads = 2;
}
