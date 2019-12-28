import { Injectable } from '@angular/core';

@Injectable()
export class DateUtil {
    public now(): number {
        return ((Date.now) ? Date.now() : (new Date()).getTime());
    }

    public format(seconds): string {
        let date = new Date(seconds * 1000);
        if (isNaN(date.getTime())) {
            return undefined;
        } else {
            return ('0' + date.getUTCHours()).slice(-2) + ':' +
                ('0' + date.getUTCMinutes()).slice(-2) + ':' +
                ('0' + date.getUTCSeconds()).slice(-2);
        }
    }
}
