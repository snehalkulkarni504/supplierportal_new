import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotDeletionReportComponent } from './lot-deletion-report.component';

describe('LotDeletionReportComponent', () => {
  let component: LotDeletionReportComponent;
  let fixture: ComponentFixture<LotDeletionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotDeletionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotDeletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
