import { Injectable } from '@angular/core';

@Injectable()
export class DateUtil {
    public now(): number {
        return ((Date.now) ? Date.now() : (new Date()).getTime());
    }
}
