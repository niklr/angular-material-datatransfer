angular-material-datatransfer
=========

Demo: https://niklr.github.io/angular-material-datatransfer/

angular-material-datatransfer is an application which combines the upload and download of multiple simultaneous files in a unified user interface. 
The application is explicitly designed for modern browsers supporting advanced [`HTML5 File API`](http://www.w3.org/TR/FileAPI/) features.

The unified user interface is built on top of Google's [Material Design](https://material.io) implemented by [Angular Material](https://material.angular.io/) using [Angular](https://angular.io/). Material Design by Google's definition is a visual language that synthesizes the classic principles of good design with the innovation and possibility of technology and science.

For multiple simultaneous uploads the open-source library called [Resumable.js](https://github.com/23/resumable.js/) is used.
Resumable.js introduces fault-tolerance into the upload of large files through HTTP. This is done by splitting each file into small chunks. Then, whenever the upload of a chunk fails, uploading is retried until the procedure completes. This allows uploads to automatically resume uploading after a network connection is lost either locally or to the server. Additionally, it allows for users to pause, resume and even recover uploads without losing state because only the currently uploading chunks will be aborted, not the entire upload.

For multiple simultaneous downloads the open-source library called [FileSaver.js](https://github.com/eligrey/FileSaver.js/) is used.
FileSaver.js implements the `saveAs()` FileSaver interface in browsers that do not natively support it.

## Upload
<kbd>
  <img src="demo/images/amd_upload_v1.gif">
</kbd>

## Download
<kbd>
  <img src="demo/images/amd_download_v1.gif">
</kbd>