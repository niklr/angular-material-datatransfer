export class CoreAppConfig {
  showUploadDropzone = true;
  uploadBrowseElementId = undefined;
  uploadDropElementId = undefined;
  paginationRppOptions = [5, 10, 25];
  simultaneousDownloads = 2;
  downloadMethod = "GET";
  downloadHeaders: any = {};
  downloadWithCredentials = false;
  downloadXhrTimeout = 0;
  preprocessHashEnabled = false;
  preprocessHashChecked = true;
  preprocessHashTarget = "https://httpbin.org";
  preprocessHashMethod = "GET";
  preprocessHashParameterName = "hash";
  preprocessHashFileNameParameterName = "filename";
  preprocessHashFunctionName = "sha1";
  preprocessHashEncodingName = "hex";
  preprocessHashInputEncodingName = "latin1";
  preprocessHashTooltipContent =
    "The preprocess option checks if the file is already on the system before uploading.";
  saveDownloadFileAs: (response: any, name: string) => void = null;
  parseMessageCallback = function (message) {
    return message;
  };
  getTarget = function (request, params) {
    let target;

    if (request === "preprocessHash" && this.preprocessHashChecked) {
      target = this.preprocessHashTarget;
    }

    if (typeof target === "function") {
      return target(params);
    }

    if (target) {
      const separator = target.indexOf("?") < 0 ? "?" : "&";
      const joinedParams = params.join("&");

      return target + separator + joinedParams;
    } else {
      return;
    }
  };
}

export class ResumableJsAppConfig {
  chunkSize = 1 * 1024 * 1024;
  forceChunkSize = false;
  simultaneousUploads = 3;
  fileParameterName = "file";
  chunkNumberParameterName = "resumableChunkNumber";
  chunkSizeParameterName = "resumableChunkSize";
  currentChunkSizeParameterName = "resumableCurrentChunkSize";
  totalSizeParameterName = "resumableTotalSize";
  typeParameterName = "resumableType";
  identifierParameterName = "resumableIdentifier";
  fileNameParameterName = "resumableFilename";
  relativePathParameterName = "resumableRelativePath";
  totalChunksParameterName = "resumableTotalChunks";
  throttleProgressCallbacks = 0.5;
  query = {};
  headers = {};
  preprocess = null;
  preprocessFile = null;
  method = "multipart";
  uploadMethod = "POST";
  testMethod = "GET";
  prioritizeFirstAndLastChunk: false;
  target = "https://httpbin.org";
  testTarget = null;
  parameterNamespace = "";
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
  chunkFormat = "blob";
  minFileSize = 1;
  maxFileSize = undefined;
  fileType = [];
  maxFilesErrorCallback = function (files, errorCount) {
    alert(
      "Please upload no more than " +
        this.maxFiles +
        " file" +
        (this.maxFiles === 1 ? "" : "s") +
        " at a time."
    );
  };
  minFileSizeErrorCallback = function (file, errorCount) {
    alert(
      file.fileName ||
        file.name +
          " is too small; please upload files larger than " +
          this.minFileSize +
          "."
    );
  };
  maxFileSizeErrorCallback = function (file, errorCount) {
    alert(
      file.fileName ||
        file.name +
          " is too large; please upload files less than " +
          this.maxFileSize +
          "."
    );
  };
  fileTypeErrorCallback = function (file, errorCount) {
    alert(
      file.fileName ||
        file.name +
          " has type not allowed; please upload files of type " +
          this.fileType +
          "."
    );
  };
}

export interface IAppConfig {
  production: boolean;
  core: CoreAppConfig;
  resumablejs: ResumableJsAppConfig;
}

export class AppConfig implements IAppConfig {
  production = true;
  core = new CoreAppConfig();
  resumablejs = new ResumableJsAppConfig();
}
