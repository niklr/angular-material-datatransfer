import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { LoggerService } from '../services';
import { _ } from 'underscore';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: ['pagination.component.scss'],
})

export class PaginationComponent implements OnInit, OnChanges {

    pages = [];

    @Input() page = 1;
    @Input() rpp = 2;
    @Input() total = 1;
    @Input() onPaginateCallback = undefined;
    @Input() rppOptions = [];

    constructor(private logger: LoggerService) { }

    ngOnInit() {
        this.setPages();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.logger.log(changes);
        this.setPages();
    }

    setPages(): void {
        let pageCount: number = this.pageCount();
        if (this.pages.length > pageCount) {
            this.pages.splice(pageCount);
        } else {
            for (let i = this.pages.length; i < pageCount; i++) {
                this.pages.push(i + 1);
            }
        }
    }

    max(): number {
        return this.hasNext() ? this.page * this.rpp : this.total;
    };

    min(): number {
        return this.total > 0 ? this.page * this.rpp - this.rpp + 1 : 0;
    };

    first(): void {
        this.page = 1;
        this.onPaginationChange();
    }

    last(): void {
        this.page = this.pageCount();
        this.onPaginationChange();
    }

    hasNext(): boolean {
        return this.page * this.rpp < this.total;
    }

    hasPrevious(): boolean {
        return this.page > 1;
    };

    moveNext(): void {
        this.page++;
        this.onPaginationChange();
    }

    movePrevious(): void {
        this.page--;
        this.onPaginationChange();
    }

    onPageChange(): void {
        this.onPaginationChange();
    }

    onRppChange(): void {
        this.setPages();
        this.page = 1;
        this.onPaginationChange();
    }

    onPaginationChange(): void {
        // this.logger.log('page: ' + this.page + ' rpp: ' + this.rpp);
        if (_.isFunction(this.onPaginateCallback)) {
            this.onPaginateCallback(this.page, this.rpp);
        }
    }

    pageCount(): number {
        return this.total > 0 ? Math.ceil(this.total / (this.rpp > 0 ? this.rpp : 1)) : 1;
    }
}
