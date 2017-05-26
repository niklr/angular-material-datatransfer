import { Component, Input } from '@angular/core';
import { LoggerService, PaginationService } from '../services';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: ['pagination.component.scss'],
})

export class PaginationComponent {

    @Input() paginationService: PaginationService;

    constructor(private logger: LoggerService) { }

    max(): number {
        return this.paginationService.max();
    };

    min(): number {
        return this.paginationService.min();
    };

    first(): void {
        this.paginationService.first();
    }

    last(): void {
        this.paginationService.last();
    }

    hasNext(): boolean {
        return this.paginationService.hasNext();
    }

    hasPrevious(): boolean {
        return this.paginationService.hasPrevious();
    };

    moveNext(): void {
        this.paginationService.moveNext();
    }

    movePrevious(): void {
        this.paginationService.movePrevious();
    }

    onPageChange(): void {
        this.paginationService.onPageChange();
    }

    onRppChange(): void {
        this.paginationService.onRppChange();
    }

    onPaginationChange(): void {
        this.paginationService.onPaginationChange();
    }

    pageCount(): number {
        return this.paginationService.pageCount();
    }
}
