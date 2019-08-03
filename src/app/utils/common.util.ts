import { Injectable } from '@angular/core';

@Injectable()
export class CommonUtil {
    public each(o: any, callback: Function): void {
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
}
