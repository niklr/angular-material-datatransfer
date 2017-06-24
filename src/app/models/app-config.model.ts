export interface IAppConfig {
    core: CoreAppConfig;
    resumablejs: ResumableJsAppConfig;
}

export class AppConfig implements IAppConfig {
    core = new CoreAppConfig();
    resumablejs = new ResumableJsAppConfig();
}

export class CoreAppConfig {
    showUploadDropzone = true;
    uploadBrowseElementId = undefined;
    uploadDropElementId = undefined;
    paginationRppOptions = [5, 10, 25];
    simultaneousDownloads = 2;
    downloadMethod = 'GET';
}

export class ResumableJsAppConfig {
    chunkSize = 1 * 1024 * 1024;
    forceChunkSize = false;
    simultaneousUploads = 3;
    fileParameterName = 'file';
    chunkNumberParameterName = 'resumableChunkNumber';
    chunkSizeParameterName = 'resumableChunkSize';
    currentChunkSizeParameterName = 'resumableCurrentChunkSize';
    totalSizeParameterName = 'resumableTotalSize';
    typeParameterName = 'resumableType';
    identifierParameterName = 'resumableIdentifier';
    fileNameParameterName = 'resumableFilename';
    relativePathParameterName = 'resumableRelativePath';
    totalChunksParameterName = 'resumableTotalChunks';
    throttleProgressCallbacks = 0.5;
    query = {};
    headers = {};
    preprocess = null;
    method = 'multipart';
    uploadMethod = 'POST';
    testMethod = 'GET';
    prioritizeFirstAndLastChunk: false;
    target = 'https://httpbin.org';
    testTarget = null;
    parameterNamespace = '';
    testChunks = true;
    generateUniqueIdentifier = null;
    getTarget = null;
    maxChunkRetries = 100;
    chunkRetryInterval = undefined;
    permanentErrors = [400, 404, 405, 415, 501];
    maxFiles = undefined;
    withCredentials = false;
    xhrTimeout = 0;
    clearInput = true;
    chunkFormat = 'blob';
    minFileSize = 1;
    maxFileSize = undefined;
    fileType = [];
    maxFilesErrorCallback = function (files, errorCount) {
        alert('Please upload no more than ' + this.maxFiles + ' file' + (this.maxFiles === 1 ? '' : 's') + ' at a time.');
    };
    minFileSizeErrorCallback = function (file, errorCount) {
        alert(file.fileName || file.name + ' is too small; please upload files larger than ' + this.minFileSize + '.');
    };
    maxFileSizeErrorCallback = function (file, errorCount) {
        alert(file.fileName || file.name + ' is too large; please upload files less than ' + this.maxFileSize + '.');
    };
    fileTypeErrorCallback = function (file, errorCount) {
        alert(file.fileName || file.name + ' has type not allowed; please upload files of type ' + this.fileType + '.');
    };
}
