import { TestBed } from "@angular/core/testing";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { PaginationComponent } from "./pagination.component";
import { LoggerService } from "../services/logger.service";
import { PaginationService } from "../services/pagination.service";
import { DatatransferStore } from "../stores/datatransfer.store";

describe("PaginationComponent", () => {
  let component: PaginationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
      ],
      declarations: [PaginationComponent],
      providers: [LoggerService, PaginationService, DatatransferStore],
    });
    const fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it("should have a defined component", () => {
    expect(component).toBeDefined();
  });
});
