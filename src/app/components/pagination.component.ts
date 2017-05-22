import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
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
    page = 1;
    rpp = 5;

    @Input() total = 1;
    @Input() rppOptions = [];

    @Output() updatePaginatedItems = new EventEmitter<any>();

    constructor(private logger: LoggerService) { }

    ngOnInit() {
        this.setPaginationInformation();
    }

    ngOnChanges(changes: SimpleChanges) {
        // this.logger.log(changes);
        this.setPaginationInformation();
    }

    setPaginationInformation(): void {
        let pageCount: number = this.pageCount();
        if (this.pages.length > pageCount) {
            this.pages.splice(pageCount);
        } else {
            for (let i = this.pages.length; i < pageCount; i++) {
                this.pages.push(i + 1);
            }
        }
        if (!_.contains(this.pages, this.page)) {
            this.page = 1;
        }
        if (!!this.rppOptions && this.rppOptions.length > 0 && !_.contains(this.rppOptions, this.rpp)) {
            this.rpp = this.rppOptions[0];
        }
        this.onPaginationChange();
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
        this.setPaginationInformation();
        this.onPaginationChange();
    }

    onRppChange(): void {
        this.setPaginationInformation();
        this.page = 1;
        this.onPaginationChange();
    }

    onPaginationChange(): void {
        let startIndex = (this.page - 1) * this.rpp;
        let endIndex = Math.min(startIndex + this.rpp, this.total);
        this.updatePaginatedItems.emit({
            startIndex: startIndex,
            endIndex: endIndex
        });
    }

    pageCount(): number {
        return this.total > 0 ? Math.ceil(this.total / (this.rpp > 0 ? this.rpp : 1)) : 1;
    }
}
