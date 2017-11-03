import { inject, TestBed } from '@angular/core/testing';
import { MatSelectModule, MatOptionModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination.component';
import { LoggerService, PaginationService } from '../services';
import { DatatransferStore } from '../stores';

describe('PaginationComponent', () => {

    let component: PaginationComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatSelectModule, MatOptionModule, MatIconModule, MatButtonModule, FormsModule
            ],
            declarations: [
                PaginationComponent
            ],
            providers: [
                LoggerService, PaginationService, DatatransferStore
            ],
        });
        const fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
    });

    it('should have a defined component', () => {
        expect(component).toBeDefined();
    });
});
