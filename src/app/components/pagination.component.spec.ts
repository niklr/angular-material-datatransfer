import { inject, TestBed } from '@angular/core/testing';

import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination.component';
import { LoggerService } from '../services';

describe('PaginationComponent', () => {

    let component: PaginationComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule, FormsModule
            ],
            declarations: [
                PaginationComponent
            ],
            providers: [
                LoggerService
            ],
        });
        const fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
    });

    it('should have a defined component', () => {
        expect(component).toBeDefined();
    });

    it('should not throw an exception when calling onPaginationChange without setting a onPaginateCallback', () => {
        expect(function () { component.onPaginationChange(); }).not.toThrow();
    });

    it('should calll onPaginateCallback upon onPaginationChange', () => {
        component.onPaginateCallback = function (page, rpp) { };
        spyOn(component, 'onPaginateCallback');
        component.onPaginationChange();
        expect(component.onPaginateCallback).toHaveBeenCalled();
    });
});
