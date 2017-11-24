import { Injectable } from '@angular/core';
import * as _ from 'underscore';

import { IDatatransfer, BaseDatatransfer } from '..';
import { IAppConfig, IDatatransferItem } from '../../models';
import { LoggerService } from '../../services';
import { TransferType } from '../../enums';
import { GuidUtil } from '../../utils';
import { Exception } from 'handlebars';

export interface IUploader extends IDatatransfer {
    assignBrowse(element, isDirectory): void;
    assignDrop(element): void;
    editPath(oldPath: string, newPath: string): void;
    editFilename(item: IDatatransferItem, name: string): void;
}

@Injectable()
export abstract class BaseUploader extends BaseDatatransfer {

    protected transferType = TransferType.Upload;

    protected preventDefault = function (e) {
        e.preventDefault();
    };

    protected stopEvent = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };

    constructor(protected logger: LoggerService, protected config: IAppConfig, protected guidUtil: GuidUtil) {
        super(logger, config, guidUtil);
    }

    protected abstract addFiles(files, event): void;

    public abstract assignBrowse(element, isDirectory): void;

    public assignDrop(element): void {
        if (typeof (element.length) === 'undefined') {
            element = [element];
        }
        this.each(element, function (e) {
            e.addEventListener('dragover', this.preventDefault, false);
            e.addEventListener('dragenter', this.preventDefault, false);
            e.addEventListener('drop', this.onDrop.bind(this), false);
        }.bind(this));
    }

    public editPath(oldPath: string, newPath: string): void {
        // TODO: don't allow special characters
    }

    public editFilename(item: IDatatransferItem, name: string): void {
        if (!item) {
            throw 'Cannot edit the filename.';
        }
        if (!name) {
            throw 'Empty filename is not allowed.';
        }
    }

    protected each(o, callback): void {
        if (typeof (o.length) !== 'undefined') {
            for (let i = 0; i < o.length; i++) {
                // Array or FileList
                if (callback(o[i]) === false) {
                    return;
                }
            }
        } else {
            for (let i in o) {
                // Object
                if (callback(i, o[i]) === false) {
                    return;
                }
            }
        }
    }

    /**
     * recursively traverse directory and collect files to upload
     * @param  {Object}   directory directory to process
     * @param  {string}   path      current path
     * @param  {File[]}   items     target list of items
     * @param  {Function} cb        callback invoked after traversing directory
     */
    protected processDirectory(directory, path, items, cb) {
        let dirReader = directory.createReader();
        dirReader.readEntries(function (entries) {
            if (!entries.length) {
                // empty directory, skip
                return cb();
            }
            // process all conversion callbacks, finally invoke own one
            this.processCallbacks(
                entries.map(function (entry) {
                    let that = this as BaseUploader;
                    // bind all properties except for callback
                    return that.processItem.bind(this, entry, path, items);
                }.bind(this)),
                cb
            );
        }.bind(this));
    }

    /**
     * processes a single upload item (file or directory)
     * @param {Object} item item to upload, may be file or directory entry
     * @param {string} path current file path
     * @param {File[]} items list of files to append new items to
     * @param {Function} cb callback invoked when item is processed
     */
    protected processItem(item, path, items, cb) {
        let entry;
        if (item.isFile) {
            // file provided
            return item.file(function (file) {
                file.relativePath = path + file.name;
                items.push(file);
                cb();
            }.bind(this));
        } else if (item.isDirectory) {
            // item is already a directory entry, just assign
            entry = item;
        } else if (item instanceof File) {
            items.push(item);
        }
        if ('function' === typeof item.webkitGetAsEntry) {
            // get entry from file object
            entry = item.webkitGetAsEntry();
        }
        if (entry && entry.isDirectory) {
            // directory provided, process it
            return this.processDirectory(entry, path + entry.name + '/', items, cb);
        }
        if ('function' === typeof item.getAsFile) {
            // item represents a File object, convert it
            item = item.getAsFile();
            if (item instanceof File) {
                // item.relativePath = path + item.name;
                items.push(item);
            }
        }
        cb(); // indicate processing is done
    }

    /**
     * Continuation-passing style list iteration.
     * Invokes all functions in list and waits for their callback to be triggered.
     * @param {Function[]} items list of functions expecting callback parameter
     * @param {Function} cb callback to trigger after the last callback has been invoked
     */
    protected processCallbacks(items, cb): void {
        if (!items || items.length === 0) {
            // empty or no list, invoke callback
            return cb();
        }
        // invoke current function, pass the next part as continuation
        items[0](function () {
            let that = this as BaseUploader;
            that.processCallbacks(items.slice(1), cb);
        }.bind(this));
    }

    protected loadFiles(items, event): void {
        if (!items.length) {
            return; // nothing to do
        }
        // $.fire('beforeAdd');
        let files = [];
        this.processCallbacks(
            Array.prototype.map.call(items, function (item) {
                let that = this as BaseUploader;
                // bind all properties except for callback
                return that.processItem.bind(this, item, '', files);
            }.bind(this)),
            function () {
                let that = this as BaseUploader;
                if (files.length) {
                    // at least one file found
                    // sort by path https://github.com/hughsk/path-sort
                    // files = _.sortBy(files, 'relativePath');
                    that.addFiles(files, event);
                }
            }.bind(this)
        );
    }

    protected onDrop(event): void {
        this.stopEvent(event);
        // handle dropped things as items if we can (this lets us deal with folders nicer in some cases)
        if (event.dataTransfer && event.dataTransfer.items) {
            this.loadFiles(event.dataTransfer.items, event);
        } else if (event.dataTransfer && event.dataTransfer.files) {
            // else handle them as files
            this.loadFiles(event.dataTransfer.files, event);
        }
    }
}
