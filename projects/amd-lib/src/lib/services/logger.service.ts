import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

// From: https://github.com/angular/angular/issues/5458
@Injectable()
export class LoggerService {

    private get enabled(): boolean {
        return !ConfigService.settings.production;
    }

    noop = () => { };

    constructor() {
    }

    get debug() {
        if (this.enabled) {
            return console.debug.bind(console);
        }
        return this.noop;
    }

    get error() {
        if (this.enabled) {
            return console.error.bind(console);
        }
        return this.noop;
    }

    get log() {
        if (this.enabled) {
            return console.log.bind(console);
        }
        return this.noop;
    }

    get info() {
        if (this.enabled) {
            return console.info.bind(console);
        }
        return this.noop;
    }

    get warn() {
        if (this.enabled) {
            return console.warn.bind(console);
        }
        return this.noop;
    }
}
